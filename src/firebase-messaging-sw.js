importScripts('https://www.gstatic.com/firebasejs/9.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/9.8.0/firebase-app-compat.js');
// importScripts('/__/firebase/9.8.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/init.js');

var app = firebase.initializeApp({
    projectId: 'ipm-task-app',
    appId: '1:272319172615:web:896504b8606c83bc',
    databaseURL: 'https://ipm-task-app.firebaseio.com',
    storageBucket: 'ipm-task-app.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyDE5ZZgwnqrb4fzpeLUgN5T_u9ASKPOiqc',
    authDomain: 'ipm-task-app.firebaseapp.com',
    messagingSenderId: '272319172615',
    measurementId: 'G-X2XG1027PH',
});

var messaging = firebase.messaging(app);

// messaging.onBackgroundMessage(function (payload) {
//     // Personalize a notificação aqui, faça algo com payload 
//     var notificationTitle = 'Título da mensagem modificado';
//     var notificationOptions = {
//         body: 'Corpo modificado.',
//         icon: '/app-logo.png'
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });