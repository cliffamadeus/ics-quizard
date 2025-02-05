import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonRouter, IonAlert, IonItem, IonLabel } from '@ionic/react';
import './Home.css';
import { logOutOutline } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const navigation = useIonRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertHeader, setAlertHeader] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Retrieve stored session data
    const storedFirstName = sessionStorage.getItem('userFirstName');
    const storedEmail = sessionStorage.getItem('userEmail');

    if (storedFirstName) setFirstName(storedFirstName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

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
      sessionStorage.clear(); // Clear session data on logout
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
            <IonTitle size="large">Welcome</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Display Student Info */}
        <IonItem>
          <IonLabel>
            <h2>Welcome, {firstName}!</h2>
            <p>Email: {email}</p>
          </IonLabel>
        </IonItem>
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
