const baseUrl = "http://localhost:8080";

jdenticon.config = {
    hues: [196],
    lightness: {
        color: [0.36, 0.70],
        grayscale: [0.24, 0.82]
    },
    saturation: {
        color: 0.51,
        grayscale: 0.10
    },
    backColor: "#86444400"
};

Vue.component('navbar', {
    props: ['username', 'isloggedin', 'profile_icon'],
    template:
    `<div>
        <div class="logo">
            <img class="logo-img" v-bind:src="image">
        </div>
        <div v-on:click="showLoginSignupForm()" v-if="isloggedin == false" class="profile-icon" >
            <p>Login/SignUp</p>
        </div>
        <div v-else class="profile-icon" >
            <p>{{ username }}</p>(<p v-on:click="logout">Logout</p>)
            <span v-html="profile_icon"></span>
        </div>
    </div>`,
    data: function () {
        return {
            logo: 'bights',
            image: 'bightsLogoSmall.png'
        }
    },
    methods:{
        showLoginSignupForm: function(){
            var loginSignupFormDisplay = document.getElementsByClassName('login-signup-form')[0]
            if(loginSignupFormDisplay.style.display == "block"){
                loginSignupFormDisplay.style.display = "none";
            }else{
                loginSignupFormDisplay.style.display = "block";
            }
        },
        logout: function(){
            localStorage.removeItem('token');
            location.reload();
        }
    }
})

Vue.component('login', {
    template:
    `<div class="login-form">
        <form v-on:submit="submitLoginForm">
            <input class="form-input" type="text" v-model="emailid" placeholder="Email ID">
            <input class="form-input" type="password" v-model="password" v-on:input="checkPasswordLength()" placeholder="Enter Password">
            <input class="form-input-button" v-bind:disabled="loginButtonDisabled" type="submit" value="Login">
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
        },
        submitLoginForm: function(e){
            e.preventDefault();
            axios({
                method: 'post',
                url: baseUrl + '/auth/login',
                data: Qs.stringify({
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
                    location.reload();
                }
            })
            .catch(error => {
                alert("Please check your username or password!!");
                this.emailid = null;
                this.password = null;
            });
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
                url: baseUrl + '/auth/signup',
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
                    location.reload();
                }
            })
            .catch(error => {
                alert("Account already exists!!");
                this.fullName = null;
                this.emailid = null;
                this.password = null;
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

Vue.component('profilebox', {
    props:['username', 'profile_icon'],
    template:
    `<div class="profile-box">
        <div class="profile-picture">
            <span v-html="profile_icon"></span>
        </div>
        <div class="details-field">
            <div class="name-field">
                <p>{{ username }}</p>
            </div>
            <div class="rating-field">
            </div>
        </div>
    </div>`
})

Vue.component('questionsbox', {
    template:
    `<div class="question-form">
        <form v-on:submit>
            <input class="form-input" type="text" v-model="question" placeholder="Type your question..">
            <input type="radio" id="general" v-model="type" value="general">
            <label for="general">General</label>
            <input type="radio" id="language" v-model="type" value="language">
            <label for="language">Language Specific</label>
            <select class="form-input" v-if="type=='language'" v-model="lang">
                <option disabled value="">Choose a language</option>
                <option v-for="language in languages" v-bind:value="language">{{ language }}</option>
            </select>
            <input class="form-input-button" v-bind:disabled="askButtonDisabled" type="submit" value="Ask">
        </form>
    </div>`,
    data: function(){
        return{
            languages: ['C', 'C++', 'Java', 'Python', 'C#', 'JavaScript'],
            question: "",
            type: null,
            lang: "",
            askButtonDisabled: true
        }
    },
    watch:{
        type: function(val){
            if(val == "general"){
                this.lang = "";
            }
        },
        question: function(val){
            if(val != ""){
                this.askButtonDisabled = false
            }else{
                this.askButtonDisabled = true
            }
        }
    }
})

Vue.component('extrasbox', {
    template:
    `<div class="extras-box">
        <div class="button-select">
            <button v-on:click="toggleSelected(0)" v-bind:class="{selected: isQuestionsActive}">Ask</button>
            <button v-on:click="toggleSelected(1)" v-bind:class="{selected: isNotificationsActive}">Notifications</button>
            <button v-on:click="toggleSelected(2)" v-bind:class="{selected: isChatsActive}">Chats</button>
        </div>
        <questionsbox v-if="isQuestionsActive"></questionsbox>
        <notificationsbox v-if="isNotificationsActive"></notificationsbox>
        <chatsbox v-if="isChatsActive"></chatsbox>
    </div>`,
    data: function(){
        return{
            isQuestionsActive: true,
            isNotificationsActive: false,
            isChatsActive: false
        }
    },
    methods:{
        toggleSelected: function(val){
            if(val == 0){
                this.isQuestionsActive = true
                this.isNotificationsActive = false
                this.isChatsActive = false
            }
            else if(val == 1){
                this.isQuestionsActive = false
                this.isNotificationsActive = true
                this.isChatsActive = false
            }
            else if(val == 2){
                this.isQuestionsActive = false
                this.isNotificationsActive = false
                this.isChatsActive = true
            }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        name: 'bights',
        isLoggedIn: false,
        profile_icon: null,
        username: null
    },
    mounted(){
        if(localStorage.getItem('token')){
            const token = localStorage.getItem('token');
            this.isLoggedIn = true;
            axios({
                method: 'get',
                url: baseUrl + '/user/profile',
                headers: {
                  'Authorization': `Bearer ${token}` 
                }
            })
            .then(response => {
                this.username = response.data.name;
                this.profile_icon = jdenticon.toSvg(response.data.emailid, 100);
            })
            .catch(error => {
                this.isLoggedIn = false;
            })
        }
        else{
            this.isLoggedIn = false;
        }
    },
})