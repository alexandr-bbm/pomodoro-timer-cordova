# pomodoro-timer

Код проекта домашнего задания "Нативные приложения на веб-технологиях".
Школа разработки интерфейсов Яндекса. Мобилизация 2017.

[Работа приложения в эмуляторе ios](http://s.csssr.ru/U3NKQ7G80/20170726004818.mp4)

[Работа приложения в эмуляторе android (genymotion)](http://s.csssr.ru/U3NKQ7G80/20170726005553.mp4)

## Описание приложения

Техника Pomodoro заключается в поочередной смене интервалов работы и отдыха с
заранее заданными временными промежутками. Данное приложение помогает следить
за выполнением этой техники и позволяет ее кастомизировать

### Использование приложения
- При запуске таймера, интервалы работы/отдыха поочередно сменяют друг друга с визуализацией времени
в виде постепенно появляющейся полуокружности.
- Окончание каждого интервала сопровождается вибрацией устройства, звуковым сигналом и появлением диалогового окна,
после подтверждения начинается отсчет следующего интервала.

### Настройки:
- Можно изменить длительности интервалов.
- Можно записать собственный звуковой сигнал, который будет воспроизводится при завершении каждого из интервалов.
- Можно загрузить собственное изображение с камеры или фотобиблиотеки, которое будет использоваться в качестве фона приложения.
- Все настройки можно сбросить в исходные значения.
- Все настройки сохраняются при выходе из приложения.

## Платформы
Вся функциональность приложения проверялась
- в эмуляторе xcode (ios10)
- в эмуляторе genymotion (Google Nexus 5, Android 6)
- на живом iphone 5s

## Технологии
- ES6
- Cordova
- React
- Webpack

## Фичи с указанием сore-plugins
- вибрация и уведомления на конец каждого интервала.
(cordova-plugin-vibration, cordova-plugin-dialogs)
- возможность записать аудио, которое будет проигрываться при завершении интервалов.
(cordova-plugin-media, cordova-plugin-device)
- нативный диалоговые окна UI при сбросе настроек (cordova-plugin-actionsheet)
- установка фото с камеры/галлереи на бэкграунд приложения
(cordova-plugin-file для сохранения изображения)