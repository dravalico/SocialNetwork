"use strict";(self["webpackChunkfrontend"]=self["webpackChunkfrontend"]||[]).push([[378],{3134:function(t,s,e){e.d(s,{Z:function(){return u}});var i=function(){var t=this,s=t._self._c;return s("b-modal",{attrs:{id:"no-auth","hide-header":"","hide-footer":""}},[s("div",{staticClass:"w-75 my-5 mx-auto"},[s("p",{staticClass:"mb-4 h4",staticStyle:{"text-align":"center"}},[t._v("You must be logged in to "),s("b-icon-heart-fill",{staticStyle:{color:"#F91880"}}),t._v(" a message ")],1),s("p",{staticStyle:{"font-weight":"300"}},[t._v(" Sign up or sign in ")]),s("router-link",{staticClass:"w-100 modal-btn mb-2 text-center",attrs:{to:"/signup"}},[t._v(" Sign up ")]),s("router-link",{staticClass:"w-100 modal-btn text-center",attrs:{to:"/signin"}},[t._v(" Sign in ")])],1)])},a=[],r=e(1001),o={},n=(0,r.Z)(o,i,a,!1,null,"3d740b34",null),u=n.exports},3043:function(t,s,e){e.r(s),e.d(s,{default:function(){return h}});var i=function(){var t=this,s=t._self._c;return s("div",{staticClass:"mx-auto vh-100"},[s("div",[s("h1",{staticClass:"display-4"},[t._v(t._s(this.user.name)+" "+t._s(this.user.surname))]),s("div",[s("h4",[t._v("@"+t._s(this.user.username))]),this.$store.getters.isAuthenticated?s("div",[this.$store.getters.userState.user.id!=this.user.id?s("div",[this.$store.getters.userState.user.following.includes(this.user.id)?s("div",[s("button",{staticClass:"btn btn-primary mb-1",on:{click:t.unfollowUser}},[t._v("Unfollow")])]):s("div",[s("button",{staticClass:"btn btn-primary mb-1",on:{click:t.followUser}},[t._v("Follow")])])]):t._e()]):t._e()]),s("h6",{staticClass:"mt-2 font-italic"},[t._v(t._s(this.user.bio))])]),s("div",{attrs:{id:"message-div"}},[0!==t.messages.length?s("div",{staticClass:"pt-2"},t._l(t.messages,(function(e){return s("div",{key:e.id,staticClass:"bordered-top"},[s("MessagePreview",{attrs:{message:e,user:t.user},on:{"forwarded-liked-event":function(s){return t.fetchUserMessages(t.user.id)},"forwarded-unliked-event":function(s){return t.fetchUserMessages(t.user.id)},"forwarded-auth-event":t.showModal}})],1)})),0):s("div",{staticClass:"bordered-top row justify-content-center pt-4"},[s("p",{staticClass:"square centerd"},[t._v("No messages yet")])])]),s("AuthModal")],1)},a=[],r=(e(7658),e(3800)),o=e(3134),n={data(){return{user:{},messages:[]}},components:{AuthModal:o.Z,MessagePreview:r.Z},watch:{"$route.query":{handler(t){this.user={},this.messages=[],this.fetchUser(t.id),this.fetchUserMessages(t.id)},immediate:!0}},methods:{async fetchUser(t){const s=await fetchApi("/social/users/"+t,{method:"GET",headers:{"Content-Type":"application/json"}});if(s.ok){let t=await s.json();this.user=t.user;let e=document.title.replace("User","@"+this.user.username);document.title=e}else 404!==s.status&&this.$router.push({path:"/error"}).catch((()=>{}))},async fetchUserMessages(t){const s=await fetchApi("/social/messages/"+t,{method:"GET",headers:{"Content-Type":"application/json"}});if(s.ok){let t=await s.json();this.messages=t.messages.reverse()}else 404!==s.status&&this.$router.push({path:"/error"}).catch((()=>{}))},async followUser(){const t=await fetchApi("/social/followers/"+this.user.id,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}});t.ok?await this.$store.dispatch("verifyAuthentication"):404!==t.status&&this.$router.push({path:"/error"}).catch((()=>{}))},async unfollowUser(){const t=await fetchApi("/social/followers/"+this.user.id,{method:"DELETE",credentials:"include",headers:{"Content-Type":"application/json"}});t.ok?await this.$store.dispatch("verifyAuthentication"):404===t.status?this.isEmpty=!0:404!==t.status&&this.$router.push({path:"/error"}).catch((()=>{}))},async reloadData(){await this.fetchUserMessages(this.user.id)},showModal(){this.$bvModal.show("no-auth")}}},u=n,l=e(1001),c=(0,l.Z)(u,i,a,!1,null,null,null),h=c.exports}}]);
//# sourceMappingURL=user.4b6d8515.js.map