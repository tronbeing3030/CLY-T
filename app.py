import io
import os

from flask import Flask, render_template, Response, request, flash, redirect, send_file, url_for, jsonify
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import delete

from dotenv import load_dotenv

load_dotenv()

from models.models import User, Product, db
from py import translate_text, ai_detect

app = Flask(__name__, static_folder='static', static_url_path='/static', template_folder='templates')
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///shop.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    try:
        return db.session.get(User, int(user_id))
    except Exception:
        return None


with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return render_template("index.html", current_user=current_user)


@app.route('/add', methods=["GET", "POST"])
@login_required
def add():
    if request.method == "POST":
        img = request.files.get("image-input")
        new_prod = Product(
            user_id=current_user.id,
            name=request.form["title"],
            description=request.form["desc"],
            price=request.form["price"],
            img=img.read(),
            mimetype=img.mimetype
        )
        db.session.add(new_prod)
        db.session.commit()
        flash("Product added successfully")
        return redirect(url_for("prod", prod_id=new_prod.id))
    return render_template("add.html", prod=None, is_edit=False, current_user=current_user)


@app.route('/edit/<int:prod_id>', methods=["GET", "POST"])
@login_required
def edit(prod_id):
    prod_s = db.get_or_404(Product, prod_id)
    if request.method == "POST":
        prod_s.name = request.form["title"]
        prod_s.description = request.form["desc"]
        prod_s.price = request.form["price"]
        img = request.files.get("image-input")
        if img and img.filename:
            prod_s.img = img.read()
            prod_s.mimetype = img.mimetype
        db.session.commit()
        flash("Product updated successfully")
        return redirect(url_for("prod", prod_id=prod_s.id))
    return render_template("add.html", prod=prod_s, is_edit=True, current_user=current_user)


@app.route('/store')
def store():
    if Product:
        result = db.session.execute(db.select(Product).order_by(Product.id.desc()))
        prods = result.scalars().all()
    else:
        prods = False
    return render_template("store.html", prods=prods, current_user=current_user)


@app.route('/prod/<int:prod_id>')
def prod(prod_id):
    prod_s = db.get_or_404(Product, prod_id)
    return render_template("prod.html", prod=prod_s, current_user=current_user)


@app.route('/profile/<int:user_id>')
def profile(user_id):
    user_s = db.get_or_404(User, user_id)
    prods = db.session.execute(db.select(Product).filter_by(user_id=user_s.id)).scalars().all()
    if current_user.is_authenticated and user_s.id == current_user.id:
        return redirect(url_for('dash'))
    return render_template("profile.html", user=user_s, prods=prods, current_user=current_user)


@app.route('/dash')
@login_required
def dash():
    prods = db.session.execute(db.select(Product).filter_by(user_id=current_user.id)).scalars().all()
    return render_template("dash.html", user=current_user, prods=prods)


@app.route('/product/image/<int:prod_id>')
def get_prod_image(prod_id):
    prod_i = db.get_or_404(Product, prod_id)

    if not prod_i.mimetype:
        return redirect(url_for('static', filename='images/ClystSmugBottle.jpg'))

    return send_file(
        io.BytesIO(prod_i.img),
        mimetype=prod_i.mimetype
    )


@app.route('/dp/<int:user_id>')
def get_dp(user_id):
    user_i = db.get_or_404(User, user_id)

    if not user_i.display_pic:
        return Response(status=204)

    return send_file(
        io.BytesIO(user_i.display_pic),
        mimetype=user_i.mimetype
    )


@app.route('/edit_dp', methods=["GET", "POST"])
@login_required
def change_dp():
    if request.method == "POST":
        img = request.files.get("image-input")
        if not img:
            return jsonify({"success": False, "error": "Add image to start"}), 400

        try:
            current_user.display_pic = img.read()
            current_user.mimetype = img.mimetype
            db.session.commit()
            return jsonify({"success": True, "message": "Profile updated"}), 200
        except Exception:
            db.session.rollback()
            return jsonify({"success": False, "error": "Error in profile update. Try again"}), 500


@app.route('/edit_profile', methods=["GET", "POST"])
@login_required
def edit_profile():
    if request.method == "POST":
        name = request.form.get("username")
        phone = request.form.get("phone")
        loc = request.form.get("location")
        try:
            current_user.name = name
            current_user.phone = phone
            current_user.location = loc
            db.session.commit()
            return jsonify({"success": True, "message": "Profile updated"}), 200
        except Exception:
            db.session.rollback()
            return jsonify({"success": False, "error": "Couldn't update profile. Try again"}), 500


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get('email')
        pwd = request.form.get('password')
        user = db.session.execute(db.select(User).where(User.email == email)).scalar()

        if user and pwd and user.password_hash and check_password_hash(user.password_hash, pwd):
            login_user(user)
            return redirect(url_for('store'))
        else:
            flash("Invalid email or password")
            return redirect(url_for('login'))
    return render_template("login.html")


@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get('name')
        email = request.form.get('email')
        pwd = request.form.get('password')
        phone = request.form.get('phone')
        loc = request.form.get('loc')

        # Check if user exists
        past_user = db.session.execute(db.select(User).where(User.email == email)).scalar()
        if past_user:
            flash('Email already registered')
            return redirect(url_for('login'))

        user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(pwd),
            phone=phone,
            location=loc,
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return redirect(url_for('store'))
    return render_template("register.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('store'))


@app.route("/del_acc", methods=["POST"])
@login_required
def del_acc():
    try:
        user_id = current_user.id
        user_email = current_user.email
        user = current_user._get_current_object()

        logout_user()

        db.session.delete(user)
        db.session.commit()

        flash('Account deleted successfully', 'success')
        print(f"User {user_email} (ID: {user_id}) and their prods deleted")
        return redirect(url_for('home'))

    except Exception:
        db.session.rollback()
        flash("Error occurred. Try again")
        return redirect(url_for('dash'))


@app.route('/delete', methods=['POST'])
@login_required
def del_prods():
    try:
        db.session.execute(delete(Product).filter_by(user_id=current_user.id))
        db.session.commit()
        return jsonify({"success": True, "message": "All products deleted"}), 200

    except Exception:
        db.session.rollback()
        return jsonify({"success": False, "error": "Couldn't delete products. Try again later"}), 500


@app.route('/del_prod/<int:prod_id>', methods=['POST'])
@login_required
def del_prod(prod_id):
    prod_s = db.get_or_404(Product, prod_id)
    try:
        db.session.delete(prod_s)
        db.session.commit()
        return jsonify({"success": True, "message": "Product deleted"}), 200

    except Exception:
        db.session.rollback()
        return jsonify({"success": False, "error": "Couldn't delete product. Try again later"}), 500


@app.route('/translate', methods=['POST'])
def translate():
    old_text_json = request.json
    old_desc = old_text_json.get("old_desc")
    translated_desc = translate_text.lang_translate(old_desc)
    return jsonify({"translated_desc": translated_desc})


@app.route('/detect_lang', methods=['POST'])
def detect_lang():
    lang_json = request.json
    old_desc = lang_json.get("old_desc")
    desc_lang = translate_text.detect_lang(old_desc)
    return jsonify({"desc_lang": desc_lang})


@app.route("/generate", methods=["POST"])
def generate():
    try:
        info_json = request.get_json(force=True)
        if not info_json:
            return jsonify({"error": "Invalid JSON body"}), 400

        image = info_json.get("curr_img")
        title = info_json.get("old_title", "")
        description = info_json.get("old_desc", "")

        # extract base64 data and MIME from data URL if provided
        image_base64 = None
        image_mime = ''
        image_url = ''
        if image and isinstance(image, str):
            if image.startswith('data:'):
                try:
                    header, b64 = image.split(',', 1)
                    image_base64 = b64
                    if ';' in header:
                        image_mime = header.split(';')[0].split(':', 1)[1]
                except Exception:
                    return jsonify({"error": "Invalid image data"}), 400
            elif image.startswith('http'):
                image_url = image

        api_key = os.environ.get('GEMINI_API_KEY')

        result = ai_detect.generate_copy_suggestions(
            content_type='product',
            prompt=title,
            description=description,
            image_url=image_url,
            image_base64=image_base64,
            image_mime=image_mime,
            api_key=api_key
        )

        if result.get('ok'):
            return jsonify({"suggestions": result.get('suggestions')}), 200

        return jsonify({"error": result.get('error', 'generation failed')}), 500

    except Exception as e:
        app.logger.exception('Unhandled exception in /generate')
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    is_production = os.environ.get("FLASK_ENV") == "production"
    app.run(debug=not is_production, host='0.0.0.0' if is_production else 'localhost')
