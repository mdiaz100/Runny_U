document.addEventListener("DOMContentLoaded", function () {
    // Función para toggle password visibility
    function setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const icon = this.querySelector('i');
                
                if (input.type === "password") {
                    input.type = "text";
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = "password";
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    // Configurar los toggles de contraseña
    setupPasswordToggles();

    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    // Manejo de Registro
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const fullname = document.getElementById("fullname").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (!email.endsWith("@soyudemedellin.edu.co")) {
                alert("El correo debe ser del dominio @soyudemedellin.edu.co");
                return;
            }

            if (password.length < 8) {
                alert("La contraseña debe tener al menos 8 caracteres.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            // Obtener usuarios registrados
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // Verificar si el email ya está registrado
            if (users.some(user => user.email === email)) {
                alert("Este correo ya está registrado.");
                return;
            }

            // Guardar nuevo usuario
            users.push({ fullname, email, password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registro exitoso. Redirigiendo al inicio de sesión...");
            window.location.href = "login.html";
        });
    }

    // Manejo de Inicio de Sesión
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Obtener usuarios registrados
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Buscar usuario con el email y contraseña correctos
            const foundUser = users.find(user => user.email === email && user.password === password);

            if (!foundUser) {
                alert("Correo o contraseña incorrectos.");
                return;
            }

            alert("Inicio de sesión exitoso. Redirigiendo...");
            localStorage.setItem("loggedIn", email);  // Guardar email del usuario logueado
            window.location.href = "index.html";
        });
    }

    // Manejo de Redirección en index.html y ocultar elementos
    if (window.location.pathname.includes("index.html")) {
        const loggedIn = localStorage.getItem("loggedIn");

        if (loggedIn) {
            // Modificar menú
            const menuHeader = document.querySelector("nav .menu-header");
            if (menuHeader) {
                menuHeader.innerHTML = `
                    <li><a href="#"><i class="fas fa-user"></i> Perfil</a></li>
                    <li><a href="#" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</a></li>
                    <li><a href="#restaurants"><i class="fas fa-utensils"></i> Restaurantes</a></li>
                `;

                // Ocultar hero 
                const hero = document.querySelector(".hero");
                if (hero) hero.style.display = "none";
            }
        }

        // Manejo del cierre de sesión
        document.addEventListener('click', function(e) {
            if (e.target && (e.target.classList.contains('logout-btn') || 
                            (e.target.parentElement && e.target.parentElement.classList.contains('logout-btn')))) {
                e.preventDefault();
                localStorage.removeItem("loggedIn");
                alert("Sesión cerrada.");
                window.location.href = "index.html";
            }
        });
    }
});


