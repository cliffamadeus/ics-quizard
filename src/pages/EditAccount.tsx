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
    const [currentPassword, setCurrentPassword] = useState('');
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
  
    useEffect(() => {
        const fetchSessionAndData = async () => {
          // Fetch the current session
          const { data: session, error: sessionError } = await supabase.auth.getSession();
      
          if (sessionError || !session || !session.session) {
            setAlertMessage('You must be logged in to access this page.');
            setShowAlert(true);
            history.push('/ics-quizard/login'); // Redirect to login if no session is found
            return;
          }
      
          // Fetch student details from Supabase using the session's email
          const { data: student, error: studentError } = await supabase
            .from('students')
            .select('first_name, middle_initial, last_name, year_level, avatar_url, email')
            .eq('email', session.session.user.email) // Use email from the session
            .single();
      
          if (studentError || !student) {
            setAlertMessage('User data not found.');
            setShowAlert(true);
            return;
          }
      
          // Populate form fields with the retrieved data
          setFirstName(student.first_name);
          setMiddleInitial(student.middle_initial || '');
          setLastName(student.last_name);
          setYearLevel(student.year_level.toString());
          setAvatarPreview(student.avatar_url);
          setEmail(student.email); // Set the email to the student data
        };
      
        fetchSessionAndData();
      }, [history]);
  
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    };
  
    const handleUpdate = async () => {
        if (password !== confirmPassword) {
          setAlertMessage("Passwords don't match.");
          setShowAlert(true);
          return;
        }
      
        // Fetch the current session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
      
        if (sessionError || !session || !session.session) {
          setAlertMessage('Error fetching session or no session available.');
          setShowAlert(true);
          return;
        }
      
        const user = session.session.user;
      
        if (!user.email) {
            setAlertMessage('Error: User email is missing.');
            setShowAlert(true);
            return;
          }
          
          const { error: passwordError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
          });
          
      
        if (passwordError) {
          setAlertMessage('Incorrect current password.');
          setShowAlert(true);
          return;
        }
      
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
      
        // 🔥 FIX: Use update() instead of upsert()
        const { error: updateError } = await supabase
          .from('students')
          .update({
            first_name: firstName,
            middle_initial: middleInitial,
            last_name: lastName,
            year_level: parseInt(yearLevel),
            avatar_url: avatarUrl,
          })
          .eq('email', user.email); // 🔹 Ensure it updates the correct user
      
        if (updateError) {
          setAlertMessage(updateError.message);
          setShowAlert(true);
          return;
        }
      
        // Update the password if a new password is provided
        if (password) {
          const { error: passwordUpdateError } = await supabase.auth.updateUser({
            password: password,
          });
      
          if (passwordUpdateError) {
            setAlertMessage(passwordUpdateError.message);
            setShowAlert(true);
            return;
          }
        }
      
        setAlertMessage('Account updated successfully!');
        setShowAlert(true);
        history.push('/ics-quizard/app');
      };
      
  
    return (
      <IonPage>
        <IonHeader>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ics-quizard/app" />
          </IonButtons>
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
  
          {/* Current Password Field */}
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonInput
                  label="Current Password"
                  type="password"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Enter Current Password"
                  value={currentPassword}
                  onIonChange={(e) => setCurrentPassword(e.detail.value!)}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
  
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonInput
                  label="New Password"
                  type="password"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Enter New Password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                >
                  <IonInputPasswordToggle slot="end" />
                </IonInput>
              </IonCol>
            </IonRow>
          </IonGrid>
  
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonInput
                  label="Confirm Password"
                  type="password"
                  labelPlacement="floating"
                  fill="outline"
                  placeholder="Confirm New Password"
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
  
