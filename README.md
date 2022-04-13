# Спецархив

> 🚧 🚧 🚧 WORK IN PROGRESS 🚧 🚧 🚧
>
> Скрипты в процессе разработки.
> Многое пока не работает.

## Инструкции

Чтобы собрать коллекцию веб-страниц, вам понадобятся:

- базовое понимание [командной строки](https://ru.wikipedia.org/wiki/Интерфейс_командной_строки) (терминала),
- небольшой опыт работы с [гитом](https://ru.wikipedia.org/wiki/Git) (системой контроля версий),
- поверхностное знакомство с форматами [JSON](https://ru.wikipedia.org/wiki/JSON) и [YAML](https://ru.wikipedia.org/wiki/YAML).

В качестве текстового редактора рекомендуется [VSCode](https://code.visualstudio.com) с расширениями
[DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv),
[Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph),
[Git Lens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens),
[Yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

В упоминаемых папках и файлах `/path/to` условно обозначает локальную папку, которую вы выделили под проект.
Например, если на вашем компьютере это `/Users/me/projects/special-archive`, то `/path/to/some-folder` в инструкциях означает `/Users/me/projects/special-archive/some-folder`.

### Требования к системе

Для запуска скриптов подойдёт любой относительно современный компьютер с любой операционной системой (Linux, macOS, Windows).
Хватит 2-4 ГБ оперативной памяти и порядка 1 ГБ свободного места на диске.

### Подготовка к работе

Эти шаги достаточно выполнить один раз, даже если вы планируете сбор нескольких коллекций архива.

1.  Убедитесь, что на машине установлены [гит](https://git-scm.com/) (система контроля версий) и [нода](https://nodejs.org/ru/) (среда запуска скриптов).
    При установке ноды рекомендуется выбрать версию LTS.

    Команды для проверки установки:

    ```sh
    git --version
    ## покажет ≥ 2.30
    
    node --version
    ## покажет ≥ 16.0, < 17
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

1.  [Клонируйте](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) этот репозиторий в папку `/path/to/tooling`.

    Если результат оказался в другой папке, например, `/path/to/special-archive-tooling` или `/path/to/archive/tooling`, то папку можно перенести.
    Связь с гитхабом при этом не потеряется.
    В качестве самопроверки убедитесь, что на вашем компьютере существует файл `/path/to/tooling/README.md`.

    Про `/path/to` написано выше.

1.  Откройте терминал, перейдите в папку `/path/to/tooling`:

    ```sh
    cd "/path/to/tooling"
    ```

    Название этой папки должно появиться слева от места ввода команды.

1.  Будучи в папке `/path/to/tooling`, установите зависимые библиотеки:

    ```sh
    yarn install
    ```

    Это займёт пару минут.

1.  Будучи в папке `/path/to/tooling`, создайте пустой файл `.env.local`:

    ```sh
    yarn exe scripts/ensure-dot-env-local.script.ts
    ```

    Запуск этой консольной команды помогает проверить общую работоспособность скриптов.
    Если возникла ошибка, следует заново пройтись по инструкции (видимо, что-то пропустили).

### Создание коллекции

Перед выполнением шагов в этом разделе вам надо получить доступ к непубличному репозиторию с данными.
Для этого свяжитесь с автором скриптов или кем-то из телеграм-чата [@ruarxivechat](https://t.me/ruarxivechat).
Вы должны быть зарегистрированным пользователем на гитхабе и сообщить свой ник.

После получения доступа:

1.  Создайте локальную папку `/path/to/data/collections`.

1.  Клонируйте созданную для вас ветку в папку `/path/to/data/collections/COLLECTION_NAME`.

    `COLLECTION_NAME` — это название коллекции (например, `region-pnz` или `topic-xyz`).
    Название папки соответствует названию ветки репозитория с данными (`collections/COLLECTION_NAME`).

1.  Откройте файл `/path/to/tooling/.env.local` как текстовый и укажите путь к коллекции архива.
    Это делается добавлением такой строчки:

    ```ini
    COLLECTION_DIR_PATH=/path/to/data/collections/COLLECTION_NAME
    ```

    Часть `COLLECTION_NAME` надо заменить на реальное название папки.

1.  Если коллекция архива новая (то есть ещё не начата кем-то другим), заполните файл `/path/to/data/collections/COLLECTION_NAME/collection-config.yml`.
    Шаблон этого файла уже будет создан до вас.
    Внутри — комментарии с подсказками.

    <!--
    ```yml
    name: Энская область
    description: Популярные паблики Энской области в ВК
    timeZone: MSK+2
    ```
    -->

    Указанный часовой пояс будет использоваться браузером во время скачивания всех страниц.
    Примеры [часовых поясов России](https://ru.wikipedia.org/wiki/%D0%92%D1%80%D0%B5%D0%BC%D1%8F_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8): `MSK` (Московское время), `MSK-1` (Калининград), `MSK+9` (Камчатка).
    Часовой пояс влияет на время, которое показывает сервер при получении снимков страниц.

1.  Закоммитьте и запушьте изменения в файле `collection-config.yml` при помощи гита.

    Этот шаг упростит дальнейшую работу над вашей коллекцией архива и обеспечит вас резервной копией.

### Регистрация веб-страниц в коллекции

Чтобы начать делать снимки страниц, необходимо добавить в коллекцию архива первые несколько ссылок.
Это могут быть ссылки на сообщества ВК или профили пользователей (`https://vk.com/typical_ensk`).
Прямые ссылки на посты (`https://vk.com/wall-123-456`)<!-- и фотографии (`https://vk.com/photo-123-456`) --> тоже можно добавить.
По задумке они будут регистрироваться сами, когда скрипты научатся читать ленты в ВК по созданным снимкам.
Пока что это не реализовано.

Регистрировать новые ссылки в коллекцию архива можно в любой момент.
Желательно держать коллекцию сфокусированной на чём-то одном, то есть не валить все ссылки в кучу.
Это упростит координацию сбора данных и их анализ.

#### По одной

1.  Введите адрес страницы, которую хотите зарегистрировать в коллекции:

    ```sh
    ## cmd.exe
    set URL_TO_REGISTER=https://vk.com/typical_ensk
    
    ## любой другой терминал
    export URL_TO_REGISTER=https://vk.com/typical_ensk
    ```

1.  Запустите скрипт для регистрации этой страницы:

    ```sh
    yarn exe scripts/web-pages/register-from-env.script.ts
    ```

    Повторите эти шаги для каждой страницы, которую хотите зарегистрировать.

#### Списком

1.  Создайте файл `/path/to/data/collections/COLLECTION_NAME/url-inbox.txt`.
    Это можно сделать вручную или скриптом:

    ```sh
    yarn exe scripts/web-pages/ensure-url-inbox.script.ts
    ```

1.  Накидайте в файл `url-inbox.txt` ссылки, которые хотите зарегистрировать.
    Каждая строчка в файле должна содержать только одну ссылку.
    Пустые строчки или строчки без ссылок проигнорируются.

    Пример:

    ```txt
    https://vk.com/id123

    https://vk.com/group123
    https://vk.com/public123
    https://vk.com/something
    какой-то текст между ссылками
    https://vk.com/wall-123-456
    ```

1.  Запустите скрипт для регистрации всех ссылок из файла `url-inbox.txt`:

    ```sh
    yarn exe scripts/web-pages/register-from-url-inbox.script.ts
    ```

1.  ![][опционально]  
    Запустите скрипт, который удалит все зарегистрированные ссылки из файла `url-inbox.txt`.
    Это поможет разглядеть ссылки, которые не получилось добавить.

    ```sh
    yarn exe scripts/web-pages/clean-up-url-inbox.script.ts
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

### Создание и обновление снимков

Архив веб-страниц состоит из их снимков.
У каждой страницы (адреса) может быть по несколько снимков, сделанных в разное время.
Снимки бывают как локальными (хранятся в коллекции), так и внешними (хранятся на сторонних серверах).

Локальные снимки более гибкие и содержательные, а внешние снимки более надёжные.
Чисто в теории локальные снимки могут быть подделкой, поэтому синхронизация с международно признанным интернет-архивом — что-то вроде получения нотариально заверенной копии документа.
Кроме надёжности мы получаем дополнительный бэкап.
Даже если весь наш архив с данными уничтожить, внешние снимки страниц всё равно останутся.

Сбор новых снимков разбит на две стадии: составление очереди заявок и её исполнение.
Очередь составляется на основе локальных данных, а исполнение требует подключения к интернету.

#### Локальные снимки: Playwright

[Playwright](https://playwright.dev) — инструмент для тестирования веб-приложений.
По сути это обёртка вокруг веб-браузера, которая позволяет автоматизировать взаимодействие с веб-страницами.
Программа может открывать веб-страницы, нажимать на ссылки и кнопки, проматывать содержимое, вводить текст и так далее.
Playwright умеет сохранять такие автоматизированные сессии в виде очень детализированных отпечатков (traces).
Отпечаток Playwright — это что-то вроде слайдов в презентации, только в формате `zip`.
Внутри архива находятся все ресурсы просмотренной веб-страницы: разметка, стили, картинки, скрипты.

Playwright — программа с открытым исходным кодом.
Формат отпечатков тоже открыт и поэтому без проблем прочитается в будущем.
Пример отпечатка страницы в Playwright [доступен на сайте проекта](https://trace.playwright.dev/?trace=https://demo.playwright.dev/reports/todomvc/data/cb0fa77ebd9487a5c899f3ae65a7ffdbac681182.zip).

Для тестировщиков веб-приложений отпечатки Playwright — это средство отладки кода.
Для нас отпечатки Playwright — это возможность сделать компактные, но содержательные локальные снимки веб-страниц.

1.  TODO

    ```sh
    yarn exe scripts/web-pages/snapshots/playwright/1-update-inventory.script.ts
    ```

1.  TODO

    ```sh
    yarn exe scripts/web-pages/snapshots/playwright/2-compose-queue.script.ts
    ```

1.  TODO

    ```sh
    ## 🚧 🚧 🚧 работает в бета-режиме 🚧 🚧 🚧
    yarn exe scripts/web-pages/snapshots/playwright/3-process-queue.script.ts
    ```

#### Внешние снимки: Wayback Machine

[Wayback Machine](https://ru.wikipedia.org/wiki/Wayback_Machine) — бесплатный онлайн-архив некоммерческой библиотеки «Архив Интернета».
Для нас это пока что единственное внешнее хранилище снимков веб-страниц.

Использование внешнего хранилища снимков дополняет сбор локальных снимков.
Комбинирование хранилищ повышает надёжность и полноту архива.

При помощи скриптов мы можем получить список уже существующих снимков Wayback Machine, а также запросить новые.

1.  Получите список снимков для веб-страниц из нашей коллекции.

    ```sh
    yarn exe scripts/web-pages/snapshots/wayback-machine/1-update-inventory.script.ts
    ```

    Повторный запуск команды пропустит веб-страницы, которые проверяли до 5 минут назад.
    Этот интервал контролируется переменной окружения `INVENTORY_UPDATE_INTERVAL_IN_MINUTES`.

1.  Составьте очередь заявок на новые снимки:

    ```sh
    yarn exe scripts/web-pages/snapshots/wayback-machine/2-compose-queue.script.ts
    ```

    Этот скрипт пройдётся по коллекции веб-страниц и посмотрит на время последних известных нам снимков в Wayback Machine.
    Страницы, которые давно не загружались, будут добавлены в очередь.
    Интервал между запрашиваемыми снимками зависит от типа и возраста конкретной страницы.
    Настроить его пока что нельзя.

1.  Обработайте очередь заявок на новые снимки:

    ```sh
    yarn exe scripts/web-pages/snapshots/wayback-machine/3-process-queue.script.ts
    ```

    Эту команду можно прерывать и перезапускать.
    Успешные заявки не будут обрабатываться по второму разу.

1.  ![][опционально]  
    Обновите локальный список снимков для веб-страниц из нашей коллекции.
    Веб-архиву нужно время для создания новых снимков, поэтому желательно подождать минут 10-30.

    ```sh
    yarn exe scripts/web-pages/snapshots/wayback-machine/1-update-inventory.script.ts
    ```

### Разбор снимков

1.  TODO

    ```sh
    ## 🚧 🚧 🚧 пока не работает 🚧 🚧 🚧
    yarn exe scripts/web-pages/snapshots/playwright/4-extract-summaries.script.ts
    yarn exe scripts/web-pages/snapshots/wayback-machine/4-extract-summaries.script.ts
    ```

    ```sh
    ## 🚧 🚧 🚧 пока не работает 🚧 🚧 🚧
    yarn exe scripts/web-pages/snapshots/extract-summary-combinations.script.ts
    ```

### Аннотация веб-страниц

1.  TODO

    ```sh
    ## 🚧 🚧 🚧 пока не работает 🚧 🚧 🚧
    yarn exe scripts/web-pages/annotations/extract-from-snapshot-summary-combinations.script.ts
    ```

### Авторегистрация новых веб-страниц на основе аннотаций

1.  TODO

    ```sh
    ## 🚧 🚧 🚧 пока не работает 🚧 🚧 🚧
    yarn exe scripts/web-pages/register-from-annotations.script.ts
    ```

[опционально]: https://img.shields.io/badge/-опционально-white.svg
