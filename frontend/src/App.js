import React, {Suspense, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {LaunchDarklyClientProvider} from '@openfeature/launchdarkly-client-provider';
import {OpenFeature, OpenFeatureProvider, useBooleanFlagValue} from "@openfeature/react-sdk";
import {Chip, CircularProgress, TextField} from "@mui/material";
import {JsonViewer} from "@textea/json-viewer";
import './App.css';
import PermitLogo from './PermitLogo.svg';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081';
const clientEnvKey = process.env.CLIENT_ENV_KEY;
const ldOpenFeatureProvider = new LaunchDarklyClientProvider(clientEnvKey, {streaming: true});
OpenFeature.setProvider(ldOpenFeatureProvider);
// FeatureToggled component that checks if a feature is enabled
const FeatureToggled = ({feature, callback, children}) => {
    const isFeatureFlagged = useBooleanFlagValue(feature, false);

    useEffect(() => {
        if (callback !== null && callback !== undefined) {
            console.log("Calling callback")
            callback();
        }

    }, [isFeatureFlagged]);
    return isFeatureFlagged ? <>{children}</> : null;
};


// App component
export const App = () => {
    const [user, setUser] = useState('');
    const [userRoles, setUserRoles] = useState([]);
    const [userAttributes, setUserAttributes] = useState({});

    const updateFeatureContext = (user) => {
        OpenFeature.setContext({targetingKey: user}).then(
            () => console.log(`Updated context target key to ${user}`)
        ).catch(
            (err) => console.error(err)
        );
    }
    const updateUserRoles = (user) => {
        if (user === '' || user === null) {
            setUserRoles([]);
            return;
        }
        fetch(`${backendUrl}/users/${user}/roles`).then(
            (res) => {
                if (res.ok) {
                    res.json().then((data) => setUserRoles(data))
                } else {
                    setUserRoles([])
                }
            }
        ).catch((err) => console.error(err));
    }

    const updateUserAttributes = (user) => {
        if (user === '' || user === null) {
            setUserRoles([]);
            return;
        }
        fetch(`${backendUrl}/users/${user}/attributes`).then(
            (res) => {
                if (res.ok) {
                    res.json().then((data) => setUserAttributes(data))
                } else {
                    setUserAttributes({})
                }
            }
        ).catch((err) => console.error(err));
    }

    const handleUserChange = (e) => {
        setUser(e.target.value);
        updateFeatureContext(e.target.value);
        updateUserRoles(e.target.value);
        updateUserAttributes(e.target.value);
    }

    const onFeatureFlagChange = () => {
        updateUserRoles(user);
        updateUserAttributes(user);
    }

    return (
        <div className={'main'}>
            <div>
                <div className="logo-container">
                    <img src={PermitLogo} alt="Permit.io Logo" className="App-logo"/>
                </div>
                <h1>Feature Toggling Demo</h1>
                <Suspense fallback={<CircularProgress/>}>
                    <TextField id="user-context-field" label="User" variant="outlined" className="TextField"
                               onChange={handleUserChange}/>
                    <h2>User Features:</h2>
                    <OpenFeatureProvider>
                        <FeatureToggled feature="us-feature" callback={onFeatureFlagChange}>
                            <Chip key="us-feature-chip" label="us-feature" variant="outlined" className="Chip"/>
                        </FeatureToggled>

                        <FeatureToggled feature="billing-feature" callback={onFeatureFlagChange}>
                            <Chip key="billing-feature-chip" label="billing-feature" variant="outlined"
                                  className="Chip"/>
                        </FeatureToggled>
                    </OpenFeatureProvider>
                    <h2>User Roles:</h2>
                    {userRoles.map((role) => {
                            return (
                                <Chip label={role} variant="outlined"/>
                            );
                        }
                    )}
                    <h2>User Attributes:</h2>
                    <JsonViewer value={userAttributes} rootName={false}/>
                </Suspense>
            </div>
        </div>
    );
};

// Render the application
ReactDOM.render(<App/>, document.getElementById('root'));
