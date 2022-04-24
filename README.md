# Special Internet Archive 📜 Спецархив

This project was created in response to a [“special military operation”](https://en.wikipedia.org/wiki/2022_Russian_invasion_of_Ukraine), which Russian army started against Ukraine in February 2022.
“Special Internet Archive” aims to automate the preservation of related online content, thus providing future researchers with historic data to analyse.

Wars of the 20<sup>th</sup> century left physical artefacts like newspapers, letters, diaries and films.
Some of these objects were studied only decades later and became crucial for shedding some light on the tragic past.
When a war takes place in the digital-first era, people are surrounded by vast streams of online content, but they rarely think about how fragile this information is.
A website is only available while a server is running and a social media post is ‘everywhere’ only until it is deleted by the author or a moderator.
Thus, if we don’t proactively preserve the present, future generations won’t be able to study the past.

This repository helps archive public web pages before they are removed or edited.
It contains software that produces structured archive collections and orchestrates snapshot capturing.
Harvested data is shaped so that it fits git repositories or cloud storage like S3.
The architecture supports various web page sources (websites) as well as multiple snapshot generators, both local and third-party.
The initial version of the tooling only works with public VK communities.
It relies on [web.archive.org](https://web.archive.org) as a third-party snapshot generator and supplements it with local [Playwright](https://playwright.dev) snapshots.
Although local snapshots are less accessible, they may contain details that third-party tools are unable to collect.

“Special Internet Archive” does not aim to “capture the whole internet”.
However, those modest datasets it helps create can be still useful for the researches of the future.

Based on the initial scope of the project, the instructions below are in Russian.
The software is written in TypeScript and its output uses English.
The code can be re-used globally to create structured archive collections with any web pages.

👀 [English version via Google Translate](https://translate.google.com/translate?sl=ru&tl=en&u=https://github.com/kachkaev/special-internet-archive/blob/main/README.md)

## Об архиве

### Основные принципы

Архив содержит _снимки_ (📸) и _аннотации_ (🏷) для публично доступных веб-страниц (🌐 адресов в интернете).

```txt
🌐 адрес 1            🌐 адрес 2          🌐 адрес 3      ...       🌐 адрес N
📸 📸 📸 📸            📸 📸                                         📸 📸 📸 📸 📸 📸
🏷                                        🏷                        🏷
```

📸 **Снимок веб-страницы** — это копия того, что выдавал сервер в конкретный момент времени.
Каждому адресу веб-страницы может соответствовать несколько снимков.
Они отличаются как временем, так и способом получения.
Снимки бывают локальными (созданные волонтёром у себя на компьютере) и сторонними (созданные внешними сервисами).

Локальные снимки более гибкие и содержательные, потому что мы сами управляем инструментами для их создания.
Сторонние снимки содержат меньше информации, но считаются более надёжными.
Чисто в теории локальные снимки могут быть подделкой, поэтому использование сторонних сервисов — это что-то вроде получения нотариально заверенных копий.
Даже если весь наш архив с данными уничтожить, сторонние снимки веб-страниц всё равно доживут до потомков.

🏷 **Аннотация веб-страницы** — это дополнительные данные, которые были добавлены человеком или скриптами в процессе архивации.
Пример аннотаций — метки (теги).
Они помогают собирать, структурировать и анализировать архивные данные, при этом хранятся отдельно от снимков веб-страниц.

> ℹ️  
> На данном этапе архивация доступна только для сообществ ВК: лент и постов с комментариями.
> Архитектура архива позволяет работать с другими источниками веб-страниц в будущем.

### Структура архива

Содержимое архива разделено на коллекции.
Каждая коллекция архива фокусируется на чём-то одном: например, _сообществах ВК в Энской области_.
Разделение архива на коллекции упрощает параллельный сбор данных, а также их хранение и анализ.

```txt
🌐 🌐 🌐 🌐            🌐 🌐 🌐 🌐 🌐         🌐 🌐 🌐                   🌐 🌐 🌐
🗃 коллекция 1        🗃 коллекция 2        🗃 коллекция 3    ...     🗃 коллекция N
↕                     ↕                     ↕                        ↕
👤                    👤👤👤                 👤                        👤👤
```

Коллекция архива — это обычная папка с файлами.
Мы не используем базы данных или закрытые форматы файлов, чтобы минимизировать зависимость архива от технологий для обработки данных.
Ключевые форматы файлов в коллекции — [JSON](https://ru.wikipedia.org/wiki/JSON) и [ZIP](https://ru.wikipedia.org/wiki/ZIP).

Для обмена собранными данными мы используем [гит](https://ru.wikipedia.org/wiki/Git) (систему контроля версий).
Это упрощает совместную работу над коллекциями архива и помогает делать резервные копии данных в процессе их сбора.
Система контроля версий не является обязательным компонентом для исследователей архива.

Код в этом репозитории не является частью архива.
Собранные данные не теряют ценность в случае утери или поломки скриптов.

### Структура коллекции архива

🗃 папка с коллекцией архива  
🌐 папка с архивом одной веб-страницы (адреса в интернете)  
📸 папка cо снимками одной веб-страницы  
📂 любая другая папка

📜 файл с первичными данными (включен в коллекцию)  
⏳ временный файл (не включен в коллекцию)  
🛠 технический файл (включен в коллекцию, но не имеет исторической ценности)

Все файлы и папки опциональные: они создаются в процессе запуска скриптов.
Если вы что-то пока не видите в своей коллекции, ничего страшного.

```txt
🗃 [collection-dir-path]/

  📂 snapshot-queues/

    ⏳ some-third-party-generator.json
    ⏳ some-local-generator.json
    ⏳ some-other-third-party-generator.json


  📂 web-pages/

    📂 some/

      📂 path/

        📂 to/

          🌐 some-web-page/
          🌐 some-other-web-page/


    📂 some-other-path/

      🌐 to-a-different-web-page/
      🌐 to-another-web-page/


  🛠 .gitattributes
  🛠 .gitignore
  🛠 .prettierrc
  🛠 README.md
  ⏳ url-inbox.txt
```

Папка `📂 web-pages` содержит данные по веб-страницам коллекции.
Структура этой папки определяется форматом интернет-адресов.
Например, `https://vk.com/wall-54321_111` соответствует папке `🌐 web-pages/vk/posts/-54321/111`.

Папка `📂 snapshot-queues` используется при [создании и обновлении снимков](#создание-и-обновление-снимков).
Файл `⏳ url-inbox.txt` нужен [для регистрации адресов веб-страниц](#регистрация-веб-страниц-списком).

Папка каждой веб-страницы имеет такую структуру:

```txt
🌐 some/path/to/some-web-page/

  📸 snapshots/

    📜 2022-03-10-011223z-some-local-generator.zip
    ⏳ 2022-03-10-011223z-some-local-generator.zip.summary.json

    ⏳ 2022-04-05-124312z-some-third-party-generator.zip
    ⏳ 2022-04-05-124312z-some-third-party-generator.zip.summary.json

    ⏳ 2022-04-27-071231z-some-other-third-party-generator.zip
    ⏳ 2022-04-27-071231z-some-other-third-party-generator.zip.summary.json

    📜 2022-05-02-182048z-some-local-generator.zip
    ⏳ 2022-05-02-182048z-some-local-generator.zip.summary.json

    ⏳ 2022-05-02-182440z-some-third-party-generator.zip
    ⏳ 2022-05-02-182440z-some-third-party-generator.zip.summary.json


  ⏳ snapshot-summary-combination.json
  📜 web-page.json
```

В файле `📜 web-page.json` хранится адрес веб-страницы, списки известных снимков (📸) и аннотация (🏷).
Это единственный обязательный файл в папке.

Папка `📸 snapshots` предназначена для снимков веб-страницы.
Локальные снимки содержат первичные данные и поэтому становятся частью коллекции (📜).
Внешние снимки — это временные файлы (⏳), так как их всегда можно скачать заново.

<!-- ↑ Возможно, это допущение будет пересмотрено. -->

Рядом со снимком веб-страницы находится сводка по этому снимку: `⏳ *.summary.json`.
Сводки [извлекаются из снимков скриптами](#извлечение-сводок-из-снимков) и содержат структурированные копии веб-страниц (например, список постов в ленте сообщества).
Файлы сводок считаются временными, потому что в них есть только данные из снимков.
Файл `⏳ snapshot-summary-combination.json` тоже генерируется локально и содержит комбинацию сводок (например, объединённый список постов за всё время архивации сообщества).

Временны́е координаты в названиях файлов (`2022-04-05-124312z`) и внутри файлов (`"2022-04-05T12:43:12Z"`) используют часовой пояс [UTC](https://ru.wikipedia.org/wiki/%D0%92%D1%81%D0%B5%D0%BC%D0%B8%D1%80%D0%BD%D0%BE%D0%B5_%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5_%D0%B2%D1%80%D0%B5%D0%BC%D1%8F) (MSK-03).
[Согласно ISO 8601](<https://en.wikipedia.org/wiki/ISO_8601#Coordinated_Universal_Time_(UTC)>), UTC обозначается литерой `Z` _(“Zulu time”)_.
Мы не убираем этот символ, чтобы не создавать путаницы с местным временем или временем по Москве.

---

Разбивка папки `📂 web-pages` на подпапки помогает упорядочить коллекцию, но не несёт в себе дополнительной информации.
Любая подпапка с файлом `📜 web-page.json` считается папкой веб-страницы (🌐).
Вложенных папок веб-страниц быть не должно:

```txt
🌐 some/path/to/some-web-page/
  📜 web-page.json


❌ some/path/to/some-web-page/some/subfolder/
  ❌ web-page.json
```

## Инструкции

Чтобы собрать коллекцию архива, вам понадобятся:

- базовое понимание [командной строки](https://ru.wikipedia.org/wiki/Интерфейс_командной_строки) (терминала),
- небольшой опыт работы с [гитом](https://ru.wikipedia.org/wiki/Git) (системой контроля версий),
- поверхностное знакомство с форматом [JSON](https://ru.wikipedia.org/wiki/JSON).

В качестве текстового редактора рекомендуется [VSCode](https://code.visualstudio.com) с расширениями
[DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv),
[Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph),
[Git Lens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) и
[Yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

В упоминаемых папках и файлах `[project-dir-path]` условно обозначает локальную папку, которую вы выделили под проект.
Например, если на вашем компьютере это `/Users/me/projects/special-internet-archive`, то `[project-dir-path]/some-folder` в инструкциях означает `/Users/me/projects/special-internet-archive/some-folder`.

### Требования к системе

Для запуска скриптов подойдёт любой относительно современный компьютер с любой операционной системой (Linux, macOS, Windows).
Хватит 4-8 ГБ оперативной памяти и порядка 2-5 ГБ свободного места на диске.

### Подготовка к работе

Эти шаги достаточно выполнить один раз, даже если вы планируете сбор нескольких коллекций архива.

1.  Убедитесь, что на машине установлены [гит](https://git-scm.com) (система контроля версий), [гит-лфс](https://git-lfs.github.com) (плагин для работы с большими файлами) и [нода](https://nodejs.org/ru) (среда запуска скриптов).
    При установке ноды рекомендуется выбрать версию LTS.

    Команды для проверки установки:

    ```sh
    git --version
    ## покажет ≥ 2.30
    
    git-lfs --version
    ## покажет ≥ 3.0
    
    node --version
    ## покажет ≥ 16.14, < 17 или ≥ 18.0, < 19
    ```

1.  Установите последнюю версию [ярна](https://yarnpkg.com) (менеджера зависимостей):

    ```sh
    npm install --global yarn
    ```

    Команда для проверки установки:

    ```sh
    yarn --version
    ## покажет ≥ 1.22
    ```

1.  [Клонируйте](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) этот репозиторий в папку `[project-dir-path]/tooling`.

    Чтобы клонировать этот приватный репозиторий, в консоли введите команду:

    ```sh
    git clone https://[github-username]:[personal-access-token]@github.com/kachkaev/special-internet-archive-tooling.git
    ```

    `[github-username]` - это ваш ник на гитхабе.
    `[personal-access-token]` - это ваш персональный токен аутентификации для доступа к приватному репозиторию.
    [Инструкция](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) по созданию персонального токена.
    Если результат оказался в другой папке, например, `[project-dir-path]/special-archive-tooling` или `[project-dir-path]/archive/tooling`, то папку можно перенести.
    Связь с гитхабом при этом не потеряется.
    В качестве самопроверки убедитесь, что на вашем компьютере существует файл `[project-dir-path]/tooling/README.md`.

    Про `[project-dir-path]` написано выше.

1.  Откройте терминал, перейдите в папку `[project-dir-path]/tooling`:

    ```sh
    cd "[project-dir-path]/tooling"
    ```

    Название этой папки должно появиться слева от места ввода команды.

1.  Будучи в папке `[project-dir-path]/tooling`, установите зависимые библиотеки:

    ```sh
    yarn install
    ```

    Это займёт пару минут.

1.  Будучи в папке `[project-dir-path]/tooling`, создайте пустой файл `.env.local`:

    ```sh
    yarn exe scripts/1-chores/ensure-dot-env-local.script.ts
    ```

    Запуск этой консольной команды помогает проверить общую работоспособность скриптов.
    Если возникла ошибка, следует заново пройтись по инструкции (видимо, что-то пропустили).

### Настройка коллекции архива

Перед выполнением шагов в этом разделе вам надо получить доступ к непубличному репозиторию с данными.
Для этого свяжитесь с автором скриптов или кем-то из телеграм-чата [@ruarxivechat](https://t.me/ruarxivechat).
Вы должны быть зарегистрированным пользователем на гитхабе и сообщить свой ник.

После получения доступа:

1.  Создайте локальную папку `[project-dir-path]/data/collections`.

1.  Клонируйте созданную для вас ветку в папку `🗃 [project-dir-path]/data/collections/[collection-id]`.

    Чтобы клонировать, в консоли введите команду из папки `[project-dir-path]/data`:

    ```sh
    git clone https://[github-username]:[personal-access-token]@github.com/kachkaev/special-internet-archive-data.git --branch=collections/[collection-id] --single-branch collections/[collection-id]
    ```

    `[github-username]` - это ваш ник на гитхабе.
    `[personal-access-token]` - это ваш персональный токен аутентификации для доступа к приватному репозиторию (создавать новый не нужно, используйте уже созданный).
    `[collection-id]` — это название коллекции (например, `region-ru-pnz` или `topic-xyz`).
    Название папки соответствует названию ветки репозитория с данными (`collections/[collection-id]`).

1.  Откройте файл `[project-dir-path]/tooling/.env.local` как текстовый и укажите путь к коллекции архива.
    Это делается добавлением такой строчки:

    ```ini
    COLLECTION_DIR_PATH=[project-dir-path]/data/collections/[collection-id]
    ```

    Части `[project-dir-path]` и `[collection-id]` надо заменить на настоящие, например:

    ```ini
    COLLECTION_DIR_PATH=/Users/me/projects/special-internet-archive/data/collections/collection-ru-pnz
    ```

<!--

1.  Если коллекция архива новая (то есть ещё не начата кем-то другим), заполните файл `[project-dir-path]/data/collections/[collection-id]/collection-config.yml`.
    Шаблон этого файла уже будет создан до вас.
    Внутри — комментарии с подсказками.

    ```yml
    name: Энская область
    description: Популярные паблики Энской области в ВК
    timeZone: MSK+2
    ```

    Указанный часовой пояс будет использоваться браузером во время скачивания всех веб-страниц.
    Примеры [часовых поясов России](https://ru.wikipedia.org/wiki/%D0%92%D1%80%D0%B5%D0%BC%D1%8F_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8): `MSK` (Московское время), `MSK-1` (Калининград), `MSK+9` (Камчатка).
    Часовой пояс влияет на время, которое показывает сервер при получении снимков веб-страниц.

1.  Закоммитьте и запушьте изменения в файле `collection-config.yml` при помощи гита.

    Этот шаг упростит дальнейшую работу над вашей коллекцией архива и обеспечит вас резервной копией.

-->

### Регистрация веб-страниц в коллекции

Чтобы начать делать снимки, необходимо добавить в коллекцию архива первые несколько ссылок на веб-страницы.
Пока что это могут быть только сообщества ВК (`https://vk.com/typical_ensk`).
или прямые ссылки на посты (`https://vk.com/wall-123-456`).
Ссылки на посты регистрировать не обязательно, так как они автоматически извлекаются из лент зарегистрированных сообществ.

Регистрировать новые ссылки в коллекцию архива можно в любой момент.
Желательно держать коллекцию сфокусированной на чём-то одном, то есть не сваливать все ссылки в кучу.
Это упростит координацию сбора данных и их анализ.

Зарегистрировать новые веб-страницы в коллекцию архива можно как списком, так и по одной.
Повторные попытки зарегистрировать одну и ту же ссылку будут проигнорированы.
Уже собранные данные при этом не потеряются.

#### Регистрация веб-страниц списком

1.  Создайте файл `⏳ [collection-dir-path]/url-inbox.txt`.
    Это можно сделать вручную или скриптом:

    ```sh
    yarn exe scripts/2-web-pages/register-from-url-inbox/1-ensure-file-exists.script.ts
    ```

1.  Накидайте в файл `⏳ [collection-dir-path]/url-inbox.txt` ссылки, которые хотите зарегистрировать.
    Каждая строчка в файле должна содержать только одну ссылку.
    Пустые строчки или строчки без ссылок проигнорируются.
    Если вы копируете ссылки из таблицы, вам не придётся ничего менять.

    Пример:

    ```txt
    https://vk.com/id123

    https://vk.com/group123
    https://vk.com/public123
    https://vk.com/something
    какой-то текст между ссылками
    https://vk.com/wall-123-456
    ```

1.  Запустите скрипт для регистрации всех ссылок из файла `⏳ [collection-dir-path]/url-inbox.txt`:

    ```sh
    yarn exe scripts/2-web-pages/register-from-url-inbox/2-register-from-file.script.ts
    ```

    Это создаст файлы `📜 [collection-dir-path]/web-pages/**/web-page.json`.

1.  ![][опционально]  
    Запустите скрипт, который удалит все зарегистрированные ссылки из файла `⏳ [collection-dir-path]/url-inbox.txt`.
    Это поможет разглядеть ссылки, которые не получилось добавить.

    ```sh
    yarn exe scripts/2-web-pages/register-from-url-inbox/3-clean-up-file.script.ts
    ```

    Пример:

    ```txt
    https://vk.com/public123
    https://vk.com/unsupported/url
    какой-то текст между ссылками
    https://vk.com/group123

    https://vk.com/wall-123-456
    ещё текст
    https://unsupported.example.com
    ```

    ↓

    ```txt
    https://vk.com/unsupported/url
    какой-то текст между ссылками

    ещё текст
    https://unsupported.example.com
    ```

#### Регистрация веб-страниц по одной

1.  Введите адрес, который хотите зарегистрировать в коллекции архива:

    ```sh
    ## cmd.exe
    set URL_TO_REGISTER=https://vk.com/typical_ensk
    
    ## любой другой терминал
    export URL_TO_REGISTER=https://vk.com/typical_ensk
    ```

1.  Запустите скрипт для регистрации этой веб-страницы:

    ```sh
    yarn exe scripts/2-web-pages/register-from-env.script.ts
    ```

    Повторите эти шаги для каждой веб-страницы, которую хотите зарегистрировать.

### Сбор снимков

Сбор новых снимков состоит из трёх действий: инвентаризация существующих снимков, составление очереди заявок на новые снимки и исполнение очереди.

#### Сторонние снимки: Wayback Machine

[Wayback Machine](https://ru.wikipedia.org/wiki/Wayback_Machine) — это некоммерческий онлайн-архив интернета.
Он [заблокирован в России](https://ru.wikipedia.org/wiki/Wayback_Machine#%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B8), поэтому для работы со снимками в этом хранилище [вам понадобится VPN](https://roskomsvoboda.org/cards/card/whydoyouneedVPN/).

[web.archive.org](https://web.archive.org) пока что выступает в роли единственного стороннего хранилища.
Возможно, в будущем мы подключим и другой онлайн-архив: [archive.ph](https://archive.ph).
Комбинирование хранилищ повышает надёжность и полноту архива.

1.  Проведите инвентаризацию существующих снимков Wayback Machine:

    ```sh
    yarn exe scripts/3-snapshots/wayback-machine/1-update-inventory.script.ts
    ```

    Этот скрипт скачает список уже существующих снимков для веб-страниц из нашей коллекции.
    Среди них могут быть как снимки, которые мы запрашивали ранее, так и снимки, которые делал кто-то другой.

    Результат будет сохранён в разделе `snapshotInventoryLookup` файлов `📜 web-page.json`.

    При повторном запуске скрипт пропустит веб-страницы, которые проверяли до 5 минут назад.
    Этот интервал контролируется переменной окружения `REPEAT_INTERVAL_IN_MINUTES`.

    Если у веб-страницы есть недавно сделанный снимок, скрипт её тоже пропустит.
    Такой режим работы ускоряет повторную инвентаризацию крупных коллекций архива.
    Чтобы провести инвентаризацию для всех страниц, задайте переменную окружения `EAGER=true`.

1.  Составьте очередь заявок на новые снимки:

    ```sh
    yarn exe scripts/3-snapshots/wayback-machine/2-compose-queue.script.ts
    ```

    Этот скрипт пройдётся по коллекции веб-страниц и посмотрит на время последних известных нам снимков в Wayback Machine.
    Веб-страницы, которые давно не загружались, будут добавлены в очередь.
    Интервал между запрашиваемыми снимками зависит от типа и возраста конкретной веб-страницы.
    Настроить его пока что нельзя.

1.  Обработайте очередь заявок на новые снимки:

    ```sh
    yarn exe scripts/3-snapshots/wayback-machine/3-process-queue.script.ts
    ```

    Скрипт посмотрит на адреса веб-страниц в очереди и отправит каждую из них через форму https://web.archive.org/save.

    Обработку очереди можно прерывать и перезапускать.
    Успешные заявки обрабатываться по второму разу не будут.

#### Локальные снимки: Playwright

[Playwright](https://playwright.dev) — инструмент для тестирования веб-приложений.
По сути это обёртка вокруг веб-браузера, которая позволяет автоматизировать взаимодействие с сайтами.
Программа может открывать веб-страницы, нажимать на ссылки и кнопки, проматывать содержимое, вводить текст и так далее.
Playwright умеет сохранять такие автоматизированные сессии в виде очень детализированных отпечатков (traces).
Отпечаток Playwright — это что-то вроде слайдов в презентации, только в формате `zip`.
Внутри архива находятся все необходимые ресурсы для отображения «слайдов»: разметка, стили и картинки.
Каждый «слайд» соответствует одному действию (например, прокрутка веб-страницы вниз).

Программа Playwright имеет открытый исходный код и свободную лицензию.
Формат отпечатков тоже открыт и поэтому без проблем прочитается в будущем.
Пример отпечатка веб-страницы в Playwright [доступен на сайте проекта](https://trace.playwright.dev/?trace=https://demo.playwright.dev/reports/todomvc/data/cb0fa77ebd9487a5c899f3ae65a7ffdbac681182.zip).

Для тестировщиков веб-приложений отпечатки Playwright — это средство отладки кода.
Для нас отпечатки Playwright — это возможность сделать компактные, но содержательные локальные снимки веб-страниц.

1.  Проведите инвентаризацию существующих снимков Playwright:

    ```sh
    yarn exe scripts/3-snapshots/playwright/1-update-inventory.script.ts
    ```

    Результат будет сохранён в разделе `snapshotInventoryLookup` файлов `📜 web-page.json`.

1.  Составьте очередь заявок на новые снимки:

    ```sh
    ## 🟡 в очередь пока что добавляются только страницы сообществ, потому что
    ## 🟡 ценность локальных снимков постов такая же, как у Wayback Machine
    yarn exe scripts/3-snapshots/playwright/2-compose-queue.script.ts
    ```

    Этот скрипт пройдётся по коллекции веб-страниц и посмотрит на время последних известных нам снимков в Playwright.
    Веб-страницы, которые давно не загружались, будут добавлены в очередь.
    Интервал между запрашиваемыми снимками зависит от типа и возраста конкретной веб-страницы.
    Настроить его пока что нельзя.

1.  Обработайте очередь заявок на новые снимки:

    ```sh
    yarn exe scripts/3-snapshots/playwright/3-process-queue.script.ts
    ```

    Обработку очереди можно прерывать и перезапускать.
    Успешные заявки обрабатываться по второму разу не будут.

### Извлечение сводок из снимков

Снимки веб-страниц содержат «сырые» данные: разметку, стили и картинки.
Мы заранее не знаем, что из этого ценно, поэтому разделяем получение данных и их обработку.

Чтобы автоматизировать архивацию постов ВК, нам нужно «прочитать» ленты сообществ и найти в них ссылки типа `https://vk.com/wall-123-456`.
Сначала мы разбираем известные нам снимки и извлекаем сводку по каждому из них.
Так как у каждой веб-страницы может быть по несколько снимков, мы комбинируем полученные сводки отдельным скриптом.

#### Сторонние снимки: Wayback Machine

> ⛔️ пока не работает

1.  Проведите повторную инвентаризацию существующих снимков.
    Сервису [web.archive.org](https://web.archive.org) нужно время для создания новых снимков, поэтому желательно подождать минут 10-30 с момента отправки заявок.

    ```sh
    yarn exe scripts/4-snapshot-summaries/wayback-machine/1-update-inventory.script.ts
    ```

    Результат будет сохранён в разделе `snapshotInventoryLookup` файлов `📜 web-page.json`.

1.  Извлеките сводки из снимков:

    ```sh
    ## ⛔️ пока не работает
    yarn exe scripts/4-snapshot-summaries/wayback-machine/2-extract-summaries.script.ts
    ```

    Этот скрипт скачает известные нам снимки из [web.archive.org](https://web.archive.org) в `⏳ [web-page-dir-path]/snapshots/*-wayback-machine.zip` и создаст файл `⏳ [web-page-dir-path]/snapshots/*-wayback-machine.zip.summary.json` для каждого снимка.

#### Локальные снимки: Playwright

1.  Проведите инвентаризацию существующих снимков:

    ```sh
    yarn exe scripts/4-snapshot-summaries/playwright/1-update-inventory.script.ts
    ```

    Результат будет сохранён в разделе `snapshotInventoryLookup` файлов `📜 web-page.json`.

1.  Извлеките сводки из снимков:

    ```sh
    ## 🟡 пока что извлекается только список постов в лентах сообществ
    yarn exe scripts/4-snapshot-summaries/playwright/2-extract-summaries.script.ts
    ```

    Этот скрипт создаст файл `⏳ [web-page-dir-path]/snapshots/*-playwright.zip.summary.json` для каждого файла `📜 [web-page-dir-path]/snapshots/*-playwright.zip`.

#### Комбинация сводок

После запуска предыдущих скриптов у нас есть сводки по каждому снимку: `⏳ [web-page-dir-path]/snapshots/*.summary.json`.
Информация в этих файлах повторяется, поэтому мы комбинируем сводки в файлы `⏳ [web-page-dir-path]/snapshot-summary-combination.json`:

```sh
yarn exe scripts/4-snapshot-summaries/extract-summary-combinations.script.ts
```

### Аннотация веб-страниц

Имея комбинацию сводок, мы можем аннотировать веб-страницу: добавить метки, указать релевантные ссылки и так далее.
По задумке эта задача будет выполняться через веб-интерфейс методом _визуальной аналитики_ ([visual analytics](https://en.wikipedia.org/wiki/Visual_analytics)).
Координатор архива откроет веб-интерфейс командой `yarn dev`, увидит содержимое коллекции архива и сможет редактировать аннотацию каждой веб-страницы.

Пока веб-интерфейса нет, воспользуйтесь авто-аннотацией:

```sh
## 🟡 релевантные ссылки определяются простым алгоритмам по заранее заданным ключевым словам
yarn exe scripts/5-annotations/extract-from-snapshot-summary-combinations.script.ts
```

Этот скрипт отметит некоторые исходящие ссылки как релевантные.
Например, релевантными станут ссылки на общественно значимые посты в ленте сообществ.

Результат будет сохранён в разделе `annotation` файлов `📜 web-page.json`.

### Работа с результатом

#### Расширение коллекции архива

Накопленные снимки и аннотации — это потенциальный источник новых веб-страниц в коллекции.
Например, лента сообщества ВК содержит ссылки на отдельные посты, а эти веб-страницы считаются релевантными.
Пользуясь уже собранными данными, мы можем расширять коллекцию архива без ручного сбора ссылок.

1.  Запустите скрипт, который найдёт релевантные ссылки в собранных данных и добавит в файл `⏳ [collection-dir-path]/url-inbox.txt`:

    ```sh
    yarn exe scripts/6-results/auto-populate-url-inbox.script.ts
    ```

1.  ![][опционально]  
    Откройте файл `⏳ [collection-dir-path]/url-inbox.txt` для проверки или ручного редактирования.

1.  Вернитесь в раздел [Регистрация веб-страниц списком](#регистрация-веб-страниц-списком) и продолжите с третьего пункта.
    Новые ссылки в файле `⏳ [collection-dir-path]/url-inbox.txt` надо добавить в коллекцию, потом собрать снимки и так далее.

    Чтобы держать коллекцию в обновлённом состоянии, весь процесс рекомендуется повторять раз в несколько дней.
    Самый лёгкий способ актуализировать коллекцию описан ниже.

### Актуализация коллекции

Запуск скриптов по одному помогает архиваторам разобраться в процессе сбора данных, а разработчикам — улучшать код.

Чтобы держать архив в актуальном состоянии, нам надо перезапускать весь процесс раз в несколько дней для каждой коллекции.
Это может быть утомительным.

Для запуска всего цикла сбора и обработки данных существует скомбинированный скрипт:

```sh
yarn exe scripts/1-chores/run-the-whole-cycle.script.ts
```

Этот скрипт запускает:

```sh
yarn exe scripts/2-web-pages/register-from-url-inbox/1-ensure-file-exists.script.ts
yarn exe scripts/2-web-pages/register-from-url-inbox/2-register-from-file.script.ts
yarn exe scripts/2-web-pages/register-from-url-inbox/3-clean-up-file.script.ts

yarn exe scripts/3-snapshots/wayback-machine/1-update-inventory.script.ts
yarn exe scripts/3-snapshots/wayback-machine/2-compose-queue.script.ts
yarn exe scripts/3-snapshots/wayback-machine/3-process-queue.script.ts

yarn exe scripts/3-snapshots/playwright/1-update-inventory.script.ts
yarn exe scripts/3-snapshots/playwright/2-compose-queue.script.ts
yarn exe scripts/3-snapshots/playwright/3-process-queue.script.ts

## ⛔️ пока не работает
# yarn exe scripts/4-snapshot-summaries/wayback-machine/1-update-inventory.script.ts
# yarn exe scripts/4-snapshot-summaries/wayback-machine/2-extract-summaries.script.ts

yarn exe scripts/4-snapshot-summaries/playwright/1-update-inventory.script.ts
yarn exe scripts/4-snapshot-summaries/playwright/2-extract-summaries.script.ts

yarn exe scripts/4-snapshot-summaries/extract-summary-combinations.script.ts

yarn exe scripts/5-annotations/extract-from-snapshot-summary-combinations.script.ts

yarn exe scripts/6-results/auto-populate-url-inbox.script.ts
```

Скомбинированный скрипт подойдет как для обновления,
так и для первичного наполнения коллекции архива.
Если коллекция новая, киньте несколько ссылок в файл `⏳ [collection-dir-path]/url-inbox.txt` перед началом.
Ссылки можно докидывать в любой момент — это расширит коллекцию.

### Работа с несколькими коллекциями

Архитектура проекта позволяет управлять несколькими коллекциями архива с одного компьютера.
Структура папок в этом случае выглядит так:

```txt
📁 [project-dir-path]/

  📁 tooling/

  📁 data/

    📁 collections/

      🗃 [collection-id-1]/

      🗃 [collection-id-2]/

         ...

      🗃 [collection-id-n]/
```

Если вы работайте с несколькими коллекциями, меняйте переменную `COLLECTION_DIR_PATH` между запусками скриптов.
Это делается в файле `[project-dir-path]/tooling/.env.local`.

[опционально]: https://img.shields.io/badge/-опционально-white.svg
