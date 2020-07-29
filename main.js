Vue.component('navbar', {
    template:
    `<div>
        <div class="logo">
            <img class="logo-img" v-bind:src="image">
        </div>
        <div v-on:click="showLoginSignupForm()" v-if="isLoggedIn == false" class="profile-icon" >
            <p>Login/SignUp</p>
        </div>
        <div v-else class="profile-icon" >
            <p>{{ username }}</p>
            <img v-bind:src="default_profile_icon">
        </div>
    </div>`,
    data: function () {
        return {
            logo: 'bights',
            image: 'bightsLogoSmall.png',
            default_profile_icon:"profile-icon-small.png",
            isLoggedIn: false,
            username: "Akhil Seshan"
        }
    },
    methods:{
        showLoginSignupForm: function(){
            document.getElementsByClassName('login-signup-form')[0].style.display = "block";
        }
    }
})

Vue.component('login', {
    template:
    `<div class="login-form">
        <form>
            <input class="form-input" type="text" v-model="emailid" placeholder="Email ID">
            <input class="form-input" type="password" v-model="password" v-on:input="checkPasswordLength()" placeholder="Enter Password">
            <input class="form-input-button" v-bind:disabled="loginButtonDisabled" type="button" value="Login">
        </form>
    </div>`,
    data: function(){
        return{
            emailid: "",
            password: "",
            loginButtonDisabled: true
        }
    },
    methods:{
        checkPasswordLength: function(){
            if(this.password.length>=8){
                this.loginButtonDisabled = false
            }else{
                this.loginButtonDisabled = true
            }
        }
    }
})

Vue.component('signup', {
    template:
    `<div class="signup-form">
        <form v-on:submit="submitSignupForm">
            <input class="form-input" type="text" v-model="fullName" placeholder="Full Name">
            <input class="form-input" type="email" v-model="emailid" placeholder="Email ID">
            <input class="form-input" type="password" v-model="password" placeholder="Create Password">
            <input class="form-input" type="password" v-model="cfPassword" v-on:input="checkConfirmPassword()" placeholder="Confirm Password">
            <input class="form-input-button" v-bind:disabled="signUpButtonDisabled" type="submit" value="Sign Up">
        </form>
    </div>`,
    data: function(){
        return{
            fullName: "",
            emailid: "",
            password: "",
            cfPassword: "",
            signUpButtonDisabled: true
        }
    },
    methods:{
        checkConfirmPassword: function(){
            if(this.cfPassword == this.password && this.password.length>=8){
                this.signUpButtonDisabled = false
            }else{
                this.signUpButtonDisabled = true
            }
        },
        submitSignupForm: function(e){
            e.preventDefault();
            axios({
                method: 'post',
                url: 'http://localhost:8080/auth/signup',
                data: Qs.stringify({
                    user_name: this.fullName,
                    user_email: this.emailid,
                    password: this.password
                }),
                headers: {
                  'content-type': 'application/x-www-form-urlencoded'
                }
            })
            .then(function(response){
                if(response.status == 200){
                    localStorage.setItem('token', response.data.token);
                }
            })
            .catch(function(error) {
                console.log("error");
            });
        }
    }
})

Vue.component('loginsignupform', {
    template:
    `<div class="login-signup-form">
        <div class="button-select">
            <button v-on:click="toggleSelected(0)" v-bind:class="{selected: isLoginActive}">Login</button>
            <button v-on:click="toggleSelected(1)" v-bind:class="{selected: isSignUpActive}">Sign Up</button>
        </div>
        <login v-if="isLoginActive"></login>
        <signup v-if="isSignUpActive"></signup>
    </div>`,
    data: function(){
        return{
            isLoginActive: true,
            isSignUpActive: false
        }
    },
    methods:{
        toggleSelected: function(val){
            if(val == 1){
                this.isLoginActive = false
                this.isSignUpActive = true
            }
            else{
                this.isLoginActive =  true
                this.isSignUpActive = false
            }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        name: 'bights'
    },
})