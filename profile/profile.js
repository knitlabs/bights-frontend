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
            image: '../bightsLogoSmall.png'
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

Vue.component('updatedetails', {
    template:
    `<div>
        
    </div>`
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