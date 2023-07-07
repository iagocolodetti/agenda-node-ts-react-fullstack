import { useState, useEffect, ReactElement, MouseEvent, KeyboardEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../actions';

import './styles.css';
import '../../bootstrap-float-label.min.css';

import DivAlert from '../../components/DivAlert';

import contactService from '../../services/contactService';

import storageAuth from '../../utils/storageAuth';

import { IPhone } from '../../interfaces/IPhone';
import { IEmail } from '../../interfaces/IEmail';

function FormContact() {
    const navigate = useNavigate();

    const authorization = storageAuth.getAuth();

    const contact = useSelector((state: any) => state.contact);

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [phones, setPhones] = useState<IPhone[]>([]);
    const [lastPhoneID, setLastPhoneID] = useState(-1);
    const [emails, setEmails] = useState<IEmail[]>([]);
    const [lastEmailID, setLastEmailID] = useState(-1);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [message, setMessage] = useState<ReactElement | null>(null);

    useEffect(() => {
        setMessage(null);
        setPhone('');
        setLastPhoneID(-1);
        setEmail('');
        setLastEmailID(-1);
        if (contact === null) {
            setName('');
            setAlias('');
            setPhones([]);
            setEmails([]);
        } else {
            setName(contact.name ? contact.name : '');
            setAlias(contact.alias ? contact.alias : '');
            setPhones(contact.phone ? contact.phone : []);
            setEmails(contact.email ? contact.email : []);
        }
    }, [contact]);

    function addPhone(e: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (phone.length > 0) {
            setPhones([...phones, {
                'id': lastPhoneID,
                'phone': phone
            }]);
            setPhone('');
            setLastPhoneID(lastPhoneID - 1);
        }
    }

    function deletePhone(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const phone = JSON.parse(e.currentTarget.value);
        if (phone.id < 0) {
            setPhones(phones.filter(p => p.id !== phone.id));
        } else {
            setPhones([...phones.filter(p => p.id !== phone.id), { ...phone, deleted: true }]);
        }
    }

    function phoneList() {
        if (phones.length > 0) {
            return (
                <>
                    <h6 className="card-subtitle mb-1 text-muted">Telefone(s)</h6>
                    <ul className="list-group text-center mb-2">
                        {phones.map(p => p.deleted === undefined || p.deleted === false ? (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={p.id}>
                                {p.phone}
                                <button className="btn btn-outline-danger btn-sm" value={JSON.stringify(p)} onClick={deletePhone}>
                                    <span className="fa fa-trash" />
                                </button>
                            </li>
                        ) : null)}
                    </ul>
                </>
            );
        } else return null;
    }

    function addEmail(e: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (email.length > 0) {
            setEmails([...emails, {
                'id': lastEmailID,
                'email': email
            }]);
            setEmail('');
            setLastEmailID(lastEmailID - 1);
        }
    }

    function deleteEmail(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const email = JSON.parse(e.currentTarget.value);
        if (email.id < 0) {
            setEmails(emails.filter(e => e.id !== email.id));
        } else {
            setEmails([...emails.filter(e => e.id !== email.id), { ...email, deleted: true }]);
        }
    }

    function emailList() {
        if (emails.length > 0) {
            return (
                <>
                    <h6 className="card-subtitle mb-1 text-muted">E-mail(s)</h6>
                    <ul className="list-group text-center mb-2">
                        {emails.map(e => e.deleted === undefined || e.deleted === false ? (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={e.id}>
                                {e.email}
                                <button className="btn btn-outline-danger btn-sm" value={JSON.stringify(e)} onClick={deleteEmail}>
                                    <span className="fa fa-trash" />
                                </button>
                            </li>
                        ) : null)}
                    </ul>
                </>
            );
        } else return null;
    }

    function buttonClearOrCancel() {
        const text = contact === null ? 'Limpar' : 'Cancelar';
        return (<button className="btn btn-secondary btn-fix" onClick={handleClearOrCancel} disabled={submitDisabled}>{text}</button>);
    }

    function handleClearOrCancel(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (contact === null) {
            setName('');
            setAlias('');
            setPhones([]);
            setLastPhoneID(-1);
            setPhone('');
            setEmails([]);
            setLastEmailID(-1);
            setEmail('');
        } else {
            dispatch(actions.contactActions.setContact(null));
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (name.length === 0) {
            setMessage(<DivAlert message={'Erro: Preencha o campo destinado ao nome.'} alert={'alert-danger'} />);
        } else if (alias.length === 0) {
            setMessage(<DivAlert message={'Erro: Preencha o campo destinado ao apelido.'} alert={'alert-danger'} />);
        } else if (phones.length === 0) {
            setMessage(<DivAlert message={'Erro: Você deve adicionar ao menos um telefone.'} alert={'alert-danger'} />);
        } else if (emails.length === 0) {
            setMessage(<DivAlert message={'Erro: Você deve adicionar ao menos um e-mail.'} alert={'alert-danger'} />);
        } else if (contact === null) {
            setSubmitDisabled(true);
            try {
                const _phones = phones.map(({ id, ...p }) => p);
                const _emails = emails.map(({ id, ...e }) => e);
                const response = await contactService.create(authorization!, { name, alias, phone: _phones, email: _emails });
                dispatch(actions.contactsActions.addContact(response.data));
                setMessage(<DivAlert message={`Contato ${name} salvo.`} alert={'alert-success'} />);
                setName('');
                setAlias('');
                setPhones([]);
                setLastPhoneID(-1);
                setPhone('');
                setEmails([]);
                setLastEmailID(-1);
                setEmail('');
            } catch (error: any) {
                if (error.response.data.status === 401) {
                    storageAuth.removeAuth();
                    storageAuth.setAuthError(error.response.data.message);
                    navigate('/login');
                } else {
                    setMessage(<DivAlert message={error.response ? `Erro: ${error.response.data.message}.` : 'Erro: Não foi possível salvar o contato.'} alert={'alert-danger'} />);
                }
            } finally {
                setSubmitDisabled(false);
            }
        } else {
            setSubmitDisabled(true);
            try {
                const _phones = [...phones];
                _phones.forEach(p => {
                    if (p.id === undefined || p.id < 0) {
                        delete p['id'];
                    }
                });
                const _emails = [...emails];
                _emails.forEach(e => {
                    if (e.id === undefined || e.id < 0) {
                        delete e['id'];
                    }
                });
                await contactService.update(authorization!, { id: contact.id, name, alias, phone: _phones, email: _emails });
                dispatch(actions.contactActions.setContact(null));
                try {
                    const response = await contactService.read(authorization!);
                    dispatch(actions.contactsActions.setContacts(response.data));
                    setMessage(<DivAlert message={'Contato atualizado.'} alert={'alert-success'} />);
                } catch (error: any) {
                    setMessage(<DivAlert message={`Contato ${name} atualizado com sucesso, porém não foi possível atualizar a lista de contatos.\n${error.response ? `Erro: ${error.response.data.message}.` : ''}`} alert={'alert-success'} />);
                } finally {
                    setSubmitDisabled(false);
                }
            } catch (error: any) {
                if (error.response.data.status === 401) {
                    storageAuth.removeAuth();
                    storageAuth.setAuthError(error.response.data.message);
                    navigate('/login');
                } else {
                    setMessage(<DivAlert message={error.response ? `Erro: ${error.response.data.message}.` : 'Erro: Não foi possível atualizar o contato.'} alert={'alert-danger'} />);
                }
            } finally {
                setSubmitDisabled(false);
            }
        }
    }

    return (
        <>
            <div className="form-group">
                <h4 className="d-flex mb-3 text-muted">Novo Contato</h4>
                <form className="card" onSubmit={handleSubmit}>
                    <div className="card-body">
                        <label className="form-group has-float-label mb-4">
                            <input type="text" className="form-control" id="name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Nome" required />
                            <span>Nome</span>
                        </label>
                        <label className="form-group has-float-label mb-4">
                            <input type="text" className="form-control" id="alias" name="alias" value={alias} onChange={e => setAlias(e.target.value)} placeholder="Apelido" required />
                            <span>Apelido</span>
                        </label>
                        {phoneList()}
                        <div className="form-group input-group mb-4">
                            <label className="has-float-label">
                                <input
                                    type="text" className="form-control" id="phone" name="phone" value={phone}
                                    onChange={e => setPhone(e.target.value)} placeholder="Telefone"
                                    onKeyDown={e => { if (e.key === 'Enter') addPhone(e) }}
                                    formNoValidate
                                />
                                <span>Telefone</span>
                            </label>
                            <div className="input-group-append">
                                <button className="btn btn-outline-primary" onClick={addPhone} formNoValidate>
                                    <span className="fa fa-plus" />
                                </button>
                            </div>
                        </div>
                        {emailList()}
                        <div className="form-group input-group mb-4">
                            <label className="has-float-label">
                                <input
                                    type="email" className="form-control" id="email" name="email" value={email}
                                    onChange={e => setEmail(e.target.value)} placeholder="E-mail"
                                    onKeyDown={e => { if (e.key === 'Enter') addEmail(e) }}
                                    formNoValidate
                                />
                                <span>E-mail</span>
                            </label>
                            <div className="input-group-append">
                                <button className="btn btn-outline-primary" onClick={addEmail} formNoValidate>
                                    <span className="fa fa-plus" />
                                </button>
                            </div>
                        </div>
                        {message}
                        <div className="d-flex justify-content-between mb-1">
                            {buttonClearOrCancel()}
                            <input type="submit" className="btn btn-primary btn-fix" value="Salvar" disabled={submitDisabled} />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default FormContact;
