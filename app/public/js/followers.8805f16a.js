"use strict";(self["webpackChunkfrontend"]=self["webpackChunkfrontend"]||[]).push([[336],{4837:function(t,e,s){s.r(e),s.d(e,{default:function(){return u}});var r=function(){var t=this,e=t._self._c;return e("div",{staticClass:"vh-100"},[e("h1",{staticClass:"display-4"},[t._v("My followers")]),0!==this.followersData.length?e("div",{staticClass:"pt-2"},t._l(t.followersData,(function(s){return e("div",{key:s.id,staticClass:"bordered-top"},[e("button",{staticClass:"blank-button w-100 text-left",on:{click:function(e){return t.openUser(s.id)}}},[e("h3",[t._v(t._s(s.name)+" "+t._s(s.surname))]),e("p",{staticStyle:{"font-size":"large"}},[t._v(" @"+t._s(s.username)+" ")])])])})),0):e("div",{staticClass:"bordered-top row justify-content-center pt-4"},[e("p",{staticClass:"square centerd"},[t._v("No followers yet")])])])},o=[],a=(s(7658),{data(){return{followersData:[]}},beforeMount(){this.fetchFollowers()},methods:{async fetchFollowers(){const t=this.$store.getters.userState.user.followers;for(let e in t){const s=await fetchApi("/social/users/"+t[e],{method:"GET",headers:{"Content-Type":"application/json"}});if(s.ok){let t=await s.json();this.followersData.push(t.user)}else 404!==s.status&&this.$router.push({path:"/error"}).catch((()=>{}))}},openUser(t){this.$router.push({path:"/user",query:{id:t}}).catch((()=>{}))}}}),n=a,l=s(1001),i=(0,l.Z)(n,r,o,!1,null,null,null),u=i.exports}}]);
//# sourceMappingURL=followers.8805f16a.js.map