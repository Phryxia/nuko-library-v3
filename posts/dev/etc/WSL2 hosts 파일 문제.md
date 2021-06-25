---
date: 2021-06-25 17:10
tags: ['wsl', 'windows', 'hosts', 'localhost', '로컬서버']
---

# 개요

윈도우 10 WSL2를 사용하여 로컬에서 개발할 때, 로컬에 띄운 서버에 접속하려면 `http://localhost:포트번호`로 접속을 해야합니다. `localhost` 이외의 주소는 브라우저에서 정상적으로 접근이 되지 않을 때가 있는데, 이는 WSL2 환경이 별도의 네트워크로 연결돼 있기 때문입니다. (공유기 포트포워딩을 안하면 내부망에 접근하지 못하는 것과 동일합니다)

그러나 개발을 하다보면 캐쉬 도메인 등의 문제로, hosts파일을 수정하여 `localhost` 이외의 도메인을 써야하는 경우가 있습니다. 이를 해결하려면 다음의 파워쉘 코드를 적당한 곳에 저장하고 아래 절차를 수행하면 됩니다.

## wsl2-port-forwarding.ps1

```
$remoteport = bash.exe -c "ifconfig eth0 | grep 'inet '"
$found = $remoteport -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';

if( $found ){
  $remoteport = $matches[0];
} else{
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}

#[Ports]

#All the ports you want to forward separated by coma
$ports=@(1234);


#[Static ip]
#You can change the addr to your ip config to listen to a specific address
$addr='0.0.0.0';
$ports_a = $ports -join ",";


#Remove Firewall Exception Rules
iex "Remove-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' ";

#adding Exception Rules for inbound and outbound Rules
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol TCP";

for( $i = 0; $i -lt $ports.length; $i++ ){
  $port = $ports[$i];
  iex "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$addr";
  iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$addr connectport=$port connectaddress=$remoteport";
}
```

이때 `$ports=@(1234);` 내에 개방할 포트 번호들을 콤마로 구분하여 적어야 합니다.

그리고 파워쉘을 **관리자 권한**으로 실행시키고 저장한 쉘 코드가 있는 디렉토리로 이동한 뒤, 아래 명령어를 입력해 줍시다.

```
PowerShell.exe -ExecutionPolicy Bypass -File .\wsl2-port-forwarding.ps1
```

# 참고

- [WSL2 포트 포워딩 / 외부에서 접근하기](https://gmyankee.tistory.com/308)
