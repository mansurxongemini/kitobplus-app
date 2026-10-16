import React, {useState, useEffect} from 'react';



const ImageInput = React.forwardRef(function ImageInput(props, ref) {
    const { title, ...otherProps } = props;
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        setSelectedFile(e.target.files[0])
    }

    return (
        <div>
            <label>{title}</label>
            <div style={{display: 'flex', height: 48, justifyContent: 'space-between', alignItems: 'center', borderRadius: 6, border: '1px solid lightgray',}}>
                <input ref={ref} style={{flex: 1}} aria-label={title} type='file' onChange={onSelectFile} />
                {selectedFile &&  <img style={{height: 48}} src={preview} /> }
            </div>
        </div>
    )
});


export default ImageInput;