import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.pushClienteNuevo = functions.firestore.document('usuarios/{usuarioId}').onCreate((snap:any,context:any)=>{
    let usuario = snap.data();
    const promises: any = [];
    if(usuario.perfil == 'cliente'){
        let query = admin.firestore().collection('usuarios').where('perfil', '==', 'Dueño');
        query.get().then((snapshot)=>{
            if(!snapshot.empty){
                snapshot.forEach(sup => {
                    let data = sup.data();
                    let payload = {
                        token: data.token,
                        notification: {
                            title: 'Ingreso nuevo cliente',
                            body: 'Habilita el nuevo cliente'
                        },
                        data:{
                            ruta: '/home/home-supervisor'
                        }
                    };
                    let p = admin.messaging().send(payload);
                    promises.push(p);
                });
                return Promise.all(promises);
            }
        return null;
        });
    }
    return null;
});