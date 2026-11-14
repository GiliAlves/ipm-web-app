import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const sendNewBoletimNotification = functions.firestore.document('/boletins/{boletimId}')
    .onCreate((snap) => {
        const newValue = snap.data();
        const payload = {
            notification: {
                title: 'Novo boletim disponível',
                body: `${newValue.liturgia.titulo} - ${newValue.liturgia.subtitulo}`,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
        };

        return admin.messaging().sendToTopic('all', payload);
    });

// Funções do game bíblico. admin.initializeApp() acima serve para todas.
export { iniciarSessao, finalizarSessao } from './game/quiz.functions';
export { definirApelido } from './game/perfil.functions';
