export default function FilePicker({ onFileSelect }) {
    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    }
    return (
        <div className="text-center">
            <h4>Select a Video File</h4>
            <input 
                type='file'  accept="video/*" 
                className="form-control mt-3" onChange={handleChange}
            />
        </div>
    );
}