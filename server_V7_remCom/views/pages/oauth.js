
window.onload = function(){
     $('custom-login-btn').onclick = loginWithKakao;
// ---------------- KakaoTalk --------------------
    Kakao.init('dcb5369f1166290a445bfbeaa7b26f53');

    // 카카오 로그인 버튼을 생성합니다.
     function loginWithKakao(){
        // 로그인 창을 띄웁니다.
        Kakao.Auth.login({
            //container: '#custom-login-btn',
            success: function(authObj){
                Kakao.API.request({
                    url: '/v1/user/me',
                    success: function(res) {
                    //alert(JSON.stringify(res));
                        var kakobj = (res);
                        new Ajax.Request("http://localhost:9080/kakao", {
                            method : "post",
                            parameters: {id: kakobj.id ,nickname: kakobj.properties.nickname},
                            onSuccess: re_direct
                        });
                    },
                    fail: function(error) {
                      alert(JSON.stringify(error))
                    }
                });
            },
            fail: function(err){
                alert(JSON.stringify(err))
            }
        });
    };

   function re_direct()             
    {                       
        location.href='http://localhost:9080/main';
    }                               
};
