import ReactDom from 'react-dom'


//an overlay that will display the details of a pokemon
export default function Modal(props){
    const {children,handleCloseModal} = props
    return ReactDom.createPortal( //new way to render a component outside of the normal flow of the DOM, without injecting it into the root div
        <div className="modal-container">
            <button onClick={handleCloseModal}
            className='modal-underlay'/>
            <div className='modal-content'>
                {children}
            </div>
        </div>,
        document.getElementById('portal')
    )
}