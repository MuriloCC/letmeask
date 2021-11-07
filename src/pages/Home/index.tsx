import { useHistory } from 'react-router-dom';
import illustrationImg from '../../assets/illustration.svg';
import logoImg from '../../assets/logo.svg';
import googleIconImg from '../../assets/google-icon.svg';
import '../../styles/auth.scss';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { db } from '../../services/firebase';
import { ref, get, child } from '@firebase/database';

export function Home(){
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');
    
    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }

        history.push("/rooms/new");
    } 

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if(roomCode.trim() === ''){
            return;
        }

        const dbRef = ref(db);

        get(child(dbRef, `rooms/${roomCode}`)).then(snapshot => {
            if(!snapshot.exists()){
                alert('room does not exists!')
                return;
            }

            if(snapshot.val().endedAt){
                alert("room already closed");
                return;
            }

            history.push(`/rooms/${roomCode}`);
        });
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração" />
                <strong>Crie salar de Q&amp;A ao vivo</strong>
                <p>Tire as duvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua sala com o google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button title="Entrar na sala" />
                    </form>
                </div>
            </main>
        </div>
    );
}