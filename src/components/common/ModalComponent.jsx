import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalComponent({title, content, handleClose, open}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClose();
    }
  };

  return (
      <div>
        <Modal
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={open}
            onKeyDown={handleKeyDown}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {content}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                  variant="contained"
                  onClick={handleClose}
                  autoFocus
              >
                확인
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
  );
}