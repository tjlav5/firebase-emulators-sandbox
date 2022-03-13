import * as React from "react";
import { animated } from "react-spring";
import { useWiggle } from "../hooks/wiggle";
import { Link } from "wouter";
import { doc, getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  FirebaseAppProvider,
  FirestoreProvider,
  useFirestoreDocData,
  useFirestore,
  useFirebaseApp,
} from "reactfire";

// Our language strings for the header
const strings = [
  "Hello React",
  "Salut React",
  "Hola React",
  "안녕 React",
  "Hej React",
];

// Utility function to choose a random value from the language array
function randomLanguage() {
  return strings[Math.floor(Math.random() * strings.length)];
}

function Foo() {
  const burritoRef = doc(useFirestore(), 'foo', 'bar');

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(burritoRef);

  // check the loading status
  if (status === 'loading') {
    return <p>Fetching burrito flavor...</p>;
  }

  return <p>The burrito is {data && data.yummy ? 'good' : 'bad'}!</p>;
}

/**
 * The Home function defines the content that makes up the main content of the Home page
 *
 * This component is attached to the /about path in router.jsx
 * The function in app.jsx defines the page wrapper that this appears in along with the footer
 */
export default function Home() {
  const firestoreInstance = getFirestore(useFirebaseApp());
  // Check for dev/test mode however your app tracks that.
  // `process.env.NODE_ENV` is a common React pattern
  // if (process.env.NODE_ENV !== 'production') {
    // Set up emulators
  try {
    console.log('emulate');
    // connectFirestoreEmulator(firestoreInstance, 'clever-obtainable-snowflake.glitch.com', '443/proxy/firestore');
    firestoreInstance._setSettings({
    ...firestoreInstance._getSettings(),
    host: `clever-obtainable-snowflake.glitch.me/proxy/firestore`,
    ssl: true
  });

  } catch (e) {
    console.log(e);
  }
  // }
    
  /* We use state to set the hello string from the array https://reactjs.org/docs/hooks-state.html
     - We'll call setHello when the user clicks to change the string
  */
  const [hello, setHello] = React.useState(strings[0]);

  /* The wiggle function defined in /hooks/wiggle.jsx returns the style effect and trigger function
     - We can attach this to events on elements in the page and apply the resulting style
  */
  const [style, trigger] = useWiggle({ x: 5, y: 5, scale: 1 });

  // When the user clicks we change the header language
  const handleChangeHello = () => {
    // Choose a new Hello from our languages
    const newHello = randomLanguage();

    // Call the function to set the state string in our component
    setHello(newHello);
  };
  return (
    <>
      <FirestoreProvider sdk={firestoreInstance}>
        <Foo />
      <h1 className="title">Hello world!!</h1>
      <a href="/foo/hub">Emulators</a>
      {/* When the user hovers over the image we apply the wiggle style to it */}
      <animated.div onMouseEnter={trigger} style={style}>
        <img
          src="https://cdn.glitch.com/2f80c958-3bc4-4f47-8e97-6a5c8684ac2c%2Fillustration.svg?v=1618196579405"
          className="illustration"
          onClick={handleChangeHello}
          alt="Illustration click to change language"
        />
      </animated.div>
      <div className="navigation">
        {/* When the user hovers over this text, we apply the wiggle function to the image style */}
        <animated.div onMouseEnter={trigger}>
          <a className="btn--click-me" onClick={handleChangeHello}>
            Psst, click me
          </a>
        </animated.div>
      </div>
      <div className="instructions">
        <h2>Using this project</h2>
        <p>
          This is the Glitch <strong>Hello React</strong> project. You can use
          it to build your own app. See more info in the{" "}
          <Link href="/about">About</Link> page, and check out README.md in the
          editor for additional detail plus next steps you can take!
        </p>
      </div>
              </FirestoreProvider>

    </>
  );
}
