import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonSelect, IonSelectOption, IonItem, IonText, IonCol, IonGrid, IonRow, IonInputPasswordToggle } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const history = useHistory();

  const handleRegister = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match.');
      setShowAlert(true);
      return;
    }

    // Check if email domain is correct
    if (!email.endsWith('@nbsc.edu.ph')) {
      setAlertMessage('Only @nbsc.edu.ph emails are allowed.');
      setShowAlert(true);
      return;
    }

    // Show the confirmation alert to verify details
    setShowConfirmationAlert(true);
  };

  const confirmRegistration = async () => {
    // Proceed with registration if user confirms details
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }
  
    // Insert user details into the "students" table
    const { error: insertError } = await supabase.from('students').insert([
      {
        email,
        first_name: firstName,
        middle_initial: middleInitial,
        last_name: lastName,
        year_level: parseInt(yearLevel),
      },
    ]);
  
    if (insertError) {
      setAlertMessage(insertError.message);
      setShowAlert(true);
      return;
    }
  
    setAlertMessage('Registration successful! Please check your email to confirm your account.');
    setShowAlert(true);
    history.push('/ics-quizard/login'); // Redirect to login page
  };
  

  const cancelRegistration = () => {
    setAlertMessage('Registration canceled.');
    setShowAlert(true);
    setShowConfirmationAlert(false); // Close confirmation alert
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ics-quizard/login" />
          </IonButtons>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonText color="secondary">
            <h1>Signup</h1>
          </IonText>
        </IonItem>
        <br></br>

        <IonGrid>
          <IonRow>
            <IonCol size="5">
                <IonInput
                  label="First Name"
                  type="text"
                  labelPlacement="floating" 
                  fill="outline"
                  placeholder="Enter First Name"
                  value={firstName}
                  onIonChange={(e) => setFirstName(e.detail.value!)}
                />
            </IonCol >
              <IonCol size="2">
                  <IonInput
                  label="M.I"
                  type="text"
                  labelPlacement="floating" 
                  fill="outline"
                  placeholder="M.I"
                  value={middleInitial}
                  onIonChange={(e) => setMiddleInitial(e.detail.value!)}
                />
            </IonCol>
            <IonCol>
                  <IonInput
                  label="Enter Last Name"
                  type="text"
                  labelPlacement="floating" 
                  fill="outline"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onIonChange={(e) => setLastName(e.detail.value!)}
                  />
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol size="5">
                <IonInput label="Institutional Email" type="email"
                placeholder="Institutional Email"
                labelPlacement="floating" 
                fill="outline"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}>
                </IonInput>
            </IonCol>
            <IonCol>
              <IonSelect
                label="Year Level"
                labelPlacement="floating" 
                fill="outline"
                value={yearLevel}
                placeholder="Select Year Level"
                onIonChange={(e) => setYearLevel(e.detail.value!)}
              >
                <IonSelectOption value="1">1st Year</IonSelectOption>
                <IonSelectOption value="2">2nd Year</IonSelectOption>
                <IonSelectOption value="3">3rd Year</IonSelectOption>
                <IonSelectOption value="4">4th Year</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>
        </IonGrid>
        
        <IonGrid>
          <IonRow>
            <IonCol size="auto">
              <IonInput
                label="Password"
                type="password"
                labelPlacement="floating" 
                fill="outline"
                placeholder="Enter Password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
              >
              <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </IonCol>
            <IonCol>
                <IonInput
                label="Confirm Password"
                type="password"
                labelPlacement="floating" 
                fill="outline"
                placeholder="Confirm Password"
                value={confirmPassword}
                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
              >
              <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
              
            </IonCol>
          </IonRow>
        </IonGrid>
      
        <IonButton expand="full" onClick={handleRegister}  shape="round">
          Register
        </IonButton>

        {/* Confirmation Alert */}
        <IonAlert
          isOpen={showConfirmationAlert}
          onDidDismiss={() => setShowConfirmationAlert(false)}
          header="Confirm Registration"
          message={`Please confirm your details:
            \nEmail: ${email}
            \nFirst Name: ${firstName}
            \nMiddle Initial: ${middleInitial}
            \nLast Name: ${lastName}
            \nYear Level: ${yearLevel}
            \n\nIs everything correct?`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: cancelRegistration,
            },
            {
              text: 'Confirm',
              handler: confirmRegistration,
            },
          ]}
        />

        {/* Alert for success or errors */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
