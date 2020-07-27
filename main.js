Vue.component('navbar', {
    template:
    `<div>
        <div class="logo">
            <img class="logo-img" v-bind:src="image">
        </div>
        <div>
        </div>
    </div>`,
    data: function () {
        return {
            logo: 'bights',
            image: 'bightsLogoSmall.png'
        }
    }
})

Vue.component('body-block', {
    template:

})

var app = new Vue({
    el: '#app',
    data: {
        name: 'bights'
    }
})