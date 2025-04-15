import { createSignal } from 'solid-js'; 

export default function() {

  const [userName, setUserName] = createSignal("");

  return (
    <>
      <label for="user-name-input">What is your name?</label>
      <input id="user-name-input" value={userName()} onchange={e => setUserName(e.target.value)} />
    </>
  );
}
