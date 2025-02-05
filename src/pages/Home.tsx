import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonRouter, IonAlert } from '@ionic/react';
import './Home.css';
import { logOutOutline } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import React from 'react';

const Home: React.FC = () => {
  const navigation = useIonRouter();
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertHeader, setAlertHeader] = React.useState('');
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAlertHeader('Logout Failed');
      setAlertMessage(error.message);
      setShowAlert(true);
    } else {
      setAlertHeader('Logout Successful');
      setAlertMessage('You have successfully logged out.');
      setShowAlert(true);
      navigation.push('/ics-quizard/', 'root', 'replace');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton fill="solid" color="danger" onClick={handleLogout}>
              Logout
              <IonIcon slot="end" icon={logOutOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>ICS Quizard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>

      {/* Alert to show logout result */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={alertHeader}
        message={alertMessage}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default Home;
