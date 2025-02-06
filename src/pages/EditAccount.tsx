import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader, IonToolbar, IonTitle,
  IonBackButton, IonButtons, IonSelect, IonSelectOption, IonItem, IonText, IonCol, IonGrid,
  IonRow, IonInputPasswordToggle, IonImg, IonAvatar,
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

const EditAccount: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preload user data from the Supabase database
  useEffect(() => {
    const loadUserData = async () => {
      const session = supabase.auth.session();
      if (session) {
        const userEmail = session.user?.email;
        if (userEmail) {
          setEmail(userEmail);

          // Fetch user details from the students table
          const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('email', userEmail)
            .single();

          if (error) {
            setAlertMessage(error.message);
            setShowAlert(true);
          } else if (data) {
            // Set form fields with the existing data
            setFirstName(data.first_name);
            setMiddleInitial(data.middle_initial || '');
            setLastName(data.last_name);
            setYearLevel(data.year_level.toString());
            setAvatarPreview(data.avatar_url || '');
          }
        }
      }
    };

    loadUserData();
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    // Handle avatar upload if the avatar file is changed
    let avatarUrl = avatarPreview;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);

      if (uploadError) {
        setAlertMessage(uploadError.message);
        setShowAlert(true);
        return;
      }

      // Get the public URL of the uploaded avatar
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      avatarUrl = urlData.publicUrl;
    }

    // Update user details in the students table
    const { error: updateError } = await supabase.from('students').upsert([
      {
        email,
        first_name: firstName,
        middle_initial: middleInitial,
        last_name: lastName,
        year_level: parseInt(yearLevel),
        avatar_url: avatarUrl, // Update avatar URL in the database
      },
    ]);

    if (updateError) {
      setAlertMessage(updateError.message);
      setShowAlert(true);
      return;
    }

    setAlertMessage('Account updated successfully!');
    setShowAlert(true);
    history.push('/ics-quizard/home'); // Redirect to home page or another desired page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ics-quizard/home" />
          </IonButtons>
          <IonTitle>Edit Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonText color="secondary">
            <h1>Edit Account</h1>
          </IonText>
        </IonItem>
        <br />

        {/* Avatar Upload Section */}
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol className="ion-text-center">
              {avatarPreview && (
                <IonAvatar style={{ width: '200px', height: '200px', margin: '10px auto' }}>
                  <IonImg src={avatarPreview} style={{ objectFit: 'cover' }} />
                </IonAvatar>
              )}

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
                Upload Avatar
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Rest of the Form */}
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
            </IonCol>
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
              <IonInput
                label="Institutional Email"
                type="email"
                placeholder="Institutional Email"
                labelPlacement="floating"
                fill="outline"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                disabled
              />
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
                <IonInputPasswordToggle slot="end" />
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
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton expand="full" onClick={handleUpdate} shape="round">
          Update Account
        </IonButton>

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

export default EditAccount;
