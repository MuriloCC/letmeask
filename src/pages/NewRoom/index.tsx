import { FormEvent, useState } from 'react';
import { ref, set, push } from "firebase/database";
import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../../assets/illustration.svg';
import logoImg from '../../assets/logo.svg';
import '../../styles/auth.scss';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';

export function NewRoom(){
    const { user } = useAuth();

    const history = useHistory();

    const [input, setInput] = useState('');

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();

        if(input.trim() === ''){
            return;
        }

        const postListRef = ref(db, 'rooms');
        const newPostRef = push(postListRef);

        await set(newPostRef, {
            title: input,
            authorId: user?.id,
        });

        history.push(`/rooms/${newPostRef.key}`);
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

                    <h1>{user?.name}</h1>
                    
                    <h2>Criar uma nova sala</h2>
                    
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setInput(event.target.value)}
                            value={input}
                        />
                        <Button title="Criar sala" />
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}