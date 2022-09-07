---
date: 2021-06-25 17:10
tags: ['wsl', 'windows', 'husky', 'vscode', 'git', 'push']
---

# 개요

WSL2 환경에서 개발 시, husky를 사용하는 환경에서 스크립트 오류가 발생하는 경우가 있습니다.

```
.husky/pre-push: 3: export: Files/WindowsApps/CanonicalGroupLimited.UbuntuonWindows_2004.2021.222.0_x64__79rhkp1fndgsc
:/mnt/c/Windows/system32:/mnt/c/Windows:/mnt/c/Windows/System32/Wbem:/mnt/c/Windows/System32/WindowsPowerShell/v1.0/
:/mnt/c/Windows/System32/OpenSSH/:/mnt/c/Users/USER/AppData/Local/Microsoft/WindowsApps
:/mnt/c/Users/USER/AppData/Local/Programs/Microsoft: bad variable name
husky - pre-push hook exited with code 2 (error)
error: failed to push some refs to 'https://~~~.git'
```

# 원인

기본적으로 WSL이 실행될 때 `$PATH`에 윈도우 path를 추가하는데, 문제는 윈도우 path에 공백이 들어가면서 생깁니다. 문제가 된 `.husky/pre-push` 스크립트를 까보면 `$PATH` 변수를 수정하는데, 이때 기존의 `$PATH`에 공백이 포함돼 있고, 이를 정상적으로 처리하지 못하면서 export에서 뻑납니다.

윈도우에서 `$PATH`를 조회해본 뒤, 에러를 자세히 보시면 특정 경로의 공백에서 잘린 걸 확인할 수 있습니다. 위의 경우는 VS Code가 문제의 원흉인데, 얘가 설치된 경로가 `C:\Users\[사용자명]\AppData\Local\Programs\Microsoft VS Code`이고 공백이 포함됐기 때문에 문제가 발생합니다.

# 해결

여러가지 방법이 있겠지만, 여기서는 윈도우가 WSL2의 `$PATH`를 건들지 못하게 막음으로서 해결할 것입니다.

먼저 WSL에서 `/etc/wsl.conf` 파일을 다음과 같이 수정합니다. (`sudo vim /etc/wsl.conf`로 편집을 하면 됩니다)

```
[interop]
appendWindowsPath=false
```

그런 뒤 윈도우에서 파워쉘을 관리자 권한으로 실행하고, 아래의 명령어를 입력하여 WSL을 완전히 종료합니다.

```
wsl --shutdown
```

그리고 다시 WSL을 켜면 위 에러는 사라집니다.

# VS Code 실행 문제

그러나... 이렇게 하면 WSL 내에서 사랑스러운 VS Code를 실행할 수 없게 됩니다. 그야 그런게 윈도우 path를 가져오지 않았으니까요. 하지만 방법이 없는 건 아닙니다. WSL 내에서 윈도우 파일에 접근할 수 있는 경로가 있으니, 그걸 이용해서 `code.exe`를 찾아서 실행하면 됩니다.

`vim ~/.bashrc` 명령어를 입력하여 설정파일을 열고, 맨 마지막에 다음을 추가해줍니다. 이때 [사용자명]에는 자신이 쓰고 있는 윈도우의 사용자명을 입력해주세요.

```
alias code='"/mnt/c/users/[사용자명]/appdata/local/programs/Microsoft VS Code/code.exe"'
```

만약 VS Code를 다른 경로에 설치한 경우, `/mnt` 뒤에 경로를 수정하면 됩니다.

마지막으로 설정파일을 적용하기 위해 `source ~/.bashrc` 명령을 실행하거나, WSL을 재부팅하면 됩니다.
