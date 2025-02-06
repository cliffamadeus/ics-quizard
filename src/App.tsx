import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect } from 'react';
import { supabase } from './utils/supabaseClient'; // Ensure supabase is properly imported
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EditAccount from './pages/EditAccount';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        history.push('/ics-quizard/login'); // Redirect to login if no session is found
      }
    };

    checkSession();
  }, [history]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/ics-quizard/" component={Login} />
          <Route exact path="/ics-quizard/login" component={Login} />
          <Route exact path="/ics-quizard/register" component={Register} />
          <Route exact path="/ics-quizard/app" component={Home} />
          <Route exact path="/ics-quizard/editAccount" component={EditAccount} />
          <Redirect exact from="/" to="/ics-quizard/login" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
