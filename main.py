from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user

app = Flask(__name__)

app.config['SECRET_KEY'] = 'myporjectshowlist'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# specify our user loader
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# CREATE TABLE IN DB
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))

# link below only required once
# db.create_all()


@app.route("/")
def home():
    if current_user.is_authenticated:
        return redirect(url_for("secrets"))

    return render_template("login.html", logged_in=current_user.is_authenticated)


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('secrets'))

    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')

        # Find user by email entered.
        user = User.query.filter_by(email=email).first()
        # Email doesn't exist
        if not user:
            flash("Email not match")
            return redirect(url_for('login'))
        # password incorrect
        elif not check_password_hash(user.password, password):
            flash('Password Incorrect')
            return redirect(url_for('login'))
        # email exist and password correct
        else:
            login_user(user)
            return redirect(url_for('secrets'))

    return render_template("login.html", logged_in=current_user.is_authenticated)

'''
# register 
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        if User.query.filter_by(email=request.form.get('email')).first():
            # User already exist
            flash("You've already signed up with that email")
            return redirect(url_for('register'))

        # hash the password
        hash_and_salted_password = generate_password_hash(
            request.form.get('password'),
            method='pbkdf2:sha256',
            salt_length=8
        )

        new_user = User(
            email=request.form.get('email'),
            name=request.form.get('name'),
            password=hash_and_salted_password
        )

        # add the user to db
        db.session.add(new_user)
        db.session.commit()

        # login in and authenticate user after adding details to db
        login_user(new_user)
        # then forward to page secrets
        return redirect(url_for("secrets"))

    return render_template("register.html", logged_in=current_user.is_authenticated)
'''

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))


# test for login
@app.route("/tlogin")
def tlogin():
    user = User.query.filter_by(email="raymond").first()
    login_user(user)
    return redirect(url_for("secrets"))


@app.route("/secrets")
@login_required
def secrets():
    print(current_user.name)
    return render_template("secrets.html", name=current_user.name, logged_in=current_user.is_authenticated)


# extra feature: Change password
@app.route("/change_password", methods=["GET", "POST"])
@login_required
def change_password():
    if request.method == "POST":
        hash_and_salted_password = generate_password_hash(
            request.form.get('password'),
            method='pbkdf2:sha256',
            salt_length=8
        )

        user = User.query.filter_by(email=current_user.email).first()
        user.password = hash_and_salted_password
        db.session.commit()

        return redirect(url_for('home'))

    return render_template("change_password.html", name=current_user.name, )


# project list:
@app.route("/mortgage_calculator")
@login_required
def mortgage_calculator():
    return render_template("projects/MortgageCalculator/index.html")


if __name__ == "__main__":
    app.run(debug=True)