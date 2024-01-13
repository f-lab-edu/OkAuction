# 프로젝트명

### **OkAuction**

본 프로젝트는 Nest.js, MySQL 및 TypeORM을 사용하여 구축된 백엔드 애플리케이션입니다. 이 애플리케이션은 프로젝트의 효율성과 유지보수를 중심으로 설계되었습니다.

## 기술 스택

![NestJS](https://img.shields.io/badge/NestJS-e0234e?style=for-the-badge&logo=nestjs&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-007ACC?style=for-the-badge&logo=typeorm&logoColor=white)

## 코딩 컨벤션

프로젝트의 코딩 컨벤션은 데이터 모델의 명확성과 일관성을 강조합니다. 엔티티 명명 규칙은 다음과 같습니다:

> 엔티티의 첫 알파벳\_컬럼명

이러한 코딩 컨벤션의 채택은 다음과 같은 장점을 제공합니다:

명확성: 접두사(c*, p* 등)를 사용함으로써, 필드가 어떤 엔티티에 속하는지 쉽게 식별할 수 있습니다.
일관성: 프로젝트 전반에 걸쳐 일관된 명명 규칙을 적용함으로써, 개발자가 코드를 더 빠르게 이해하고 효율적으로 작업할 수 있습니다.
유지보수 용이성: 명확하고 일관된 명명 규칙은 향후 코드 변경, 업데이트 및 디버깅을 용이하게 합니다.

### 폴더 구조

프로젝트의 폴더 구조는 도메인 중심적으로 구성되어 있습니다. 각 도메인(예: user, product)은 관련된 엔티티, 서비스, 컨트롤러를 하나의 폴더 내에서 관리합니다. 이러한 구조는 다음과 같은 형태로 구성됩니다:

```
src/
|-- user/
| |-- user.entity.ts
| |-- user.service.ts
| |-- user.controller.ts
|-- product/
| |-- product.entity.ts
| |-- product.service.ts
| |-- product.controller.ts
|-- ... (기타 도메인)
```

도메인별 폴더 구조의 장점

모듈성: 각 도메인은 자체적인 모듈로서 기능하며, 관련된 모든 파일이 동일한 폴더 내에 있습니다. 이는 모듈 간의 응집도를 높이고, 결합도를 낮추는 데 도움이 됩니다.

유지보수 용이성: 관련된 파일들이 함께 위치함으로써, 도메인에 대한 변경사항이나 확장이 필요할 때 해당 도메인의 폴더만을 수정하면 됩니다. 이는 유지보수를 간편하게 만듭니다.

프로젝트의 가독성 향상: 새로운 개발자가 프로젝트에 참여할 때, 각 도메인과 관련된 모든 요소를 한 곳에서 찾을 수 있어 빠르게 이해하고 작업에 참여할 수 있습니다.

확장성: 새로운 기능이나 도메인을 추가하는 경우, 기존 구조에 쉽게 통합할 수 있으며, 각 도메인을 독립적으로 관리하고 확장할 수 있습니다.

>

### API 시퀀스 다이어그램

#### BidsAPI

![BidsAPI](https://raw.githubusercontent.com/f-lab-edu/OkAuction/restclient/puml/bidsAPI.png)

#### ProductsAPI

![ProductsAPI](https://raw.githubusercontent.com/f-lab-edu/OkAuction/restclient/puml/productsAPI.png)

#### CategoriesAPI

![Categories](https://raw.githubusercontent.com/f-lab-edu/OkAuction/restclient/puml/categoriesAPI.png)

#### UsersAPI

![UsersAPI](https://raw.githubusercontent.com/f-lab-edu/OkAuction/restclient/puml/usersAPI.png)
