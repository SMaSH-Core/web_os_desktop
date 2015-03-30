<<<<<<< HEAD
PIVOT
==============
welcome to pivot.gift!

=======
#  PIVOT

## 소개
**PIVOT**은 *Web Desktop* 환경을 구현하기 위한 프로젝트입니다.  <http://pivot.gift>

## 개발환경
#### Server
* Language : `Node.js`, `ejs`

#### Client
* Language : `Angular.js`, `HTML`, `CSS`
* 

#서버쪽 브랜치 -skeletonCode


####3/8 Server#1
-session
지난번에 본 예제로 간단한 세션구현.
(실제 mysqlDB에서 사용자 받는방식이 아니라 실적용하려면 수정필요함)
수정중에 사용한 flash, session에서 준 옵션들 잘 모르겠음. 


####3/9 Server#1-2
package.json추가

####3/13 구조화
* main , login, signup 의 구조화를 했음
* module.js에 디비에 데이터가 존재하는지 안하는지를 검사하는 함수 생성.
* login과 signup 폼 양식의 email이 서로 다른것 확인 , 수정했음 좋겠음
* dup과 nfound로 렌더링 됬을때, js가 먹히지 않는 버그 현상 확인.

####3/18 DB변경
* 몽구스 모듈로 몽고디비 연동만함. 실제에 맞게 변경필요
* post 주석 추가
* passport로 구글과 페이스북 연동할 계획
* 아직 dup와 nfound 버그 해결 안됨
* login signup 폼 양식 비일치
 

#### 3/24 DB변동 세션 
* DB연동 local-login, local-signup 
* auth로 facebook및 구글 연동
* 메모리 세션에 유저 email, name, 앱 정보 저장하게 설정
* main에서 앱, 위젯 추가삭제시 어떻게 처리해야할지 고민필요
* dup, nfound 처리해줬음 좋겠음
* routes.js(get, post처리), server_10.js(환경 구축 및 운용), db_oauth.js(oauth, passport, mongoDB), module.js(라우터 처리시 필요한 중간함수) 로 나눔

#### 3/26 세션으로 main 랜더링 작업 시작
* 포트 사용방식 변경, 불필요한 로그 기록 삭제
* module.js파일안에 세션확인 함수생성, app.use로 적용중
* wid fs에서 읽는방식에서 변경
* 불필요한 login2 삭제


#### 3/29 모듈화 완료
* db.js, passport.js, module.js, routes.js, SERVER.js 로 모듈
* 다음 미팅때까지 목표 설정
 
