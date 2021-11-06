import { ButtonHTMLAttributes } from 'react';
import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &{
    title: string;
    isOutlined?: boolean,
}

export function Button({ 
    isOutlined = false, 
    title, 
    ...props }: ButtonProps){
    return(
        <button className={`button ${isOutlined ? 'outlined' : '' }`} {...props}>
            {title}
        </button>
    );
}