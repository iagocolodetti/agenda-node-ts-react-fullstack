import './styles.css';

function DivAlert(props: { message: string, alert: string }) {
    const { message, alert } = props;

    return (
        <div className="d-flex justify-content-center mt-4 mb-2">
            <span className={"alert " + alert + " alert-fix text-center"} role="alert">
                {message}
            </span>
        </div>
    );
}

export default DivAlert;
