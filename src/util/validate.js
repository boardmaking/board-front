function isBlank(value) {
  return value.trim() === '';
}

function validateBoardForm({title, content,}) {
  console.log('title', title);
  const errors = {
    title: '',
    content: '',
  };

  if (isBlank(title)) {
    errors.title = '제목을 입력해주세요.';
  }

  if (isBlank(content)) {
    errors.content = '내용을 입력해주세요.';
  }

  return errors;
}

export {validateBoardForm};