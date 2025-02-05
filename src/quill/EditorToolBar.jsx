import React from 'react';
import '../styles/quillstyle.css'
import {Quill} from "react-quill-new";

// 폰트 크키
const Size = Quill.import("formats/size");
Size.whitelist = ["small", "medium", "large", "huge"];
Quill.register(Size, true)

// 폰트 스타일
const Font = Quill.import("attributors/class/font");
Font.whitelist = ["arial", "buri", "gangwon"];
Quill.register(Font, true);

function EditorToolBar(props) {
  return (
      <>
        <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="buri">Buri</option>
        <option value="gangwon">Gangwon</option>
      </select>
      <select className="ql-size" defaultValue="medium">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>
      <select className="ql-header">
        <option value="1">Header 1</option>
        <option value="2">Header 2</option>
        <option value="3">Header 3</option>
        <option value="4">Header 4</option>
        <option value="5">Header 5</option>
        <option value="6">Header 6</option>
      </select>
      </span>
          <span className="ql-formats">
      <button className="ql-bold"/>
      <button className="ql-italic"/>
      <button className="ql-underline"/>
      <button className="ql-strike"/>
      <button className="ql-blockquote"/>
    </span>
          <span className="ql-formats">
      <select className="ql-color"/>
      <select className="ql-background"/>
    </span>
          <span>
      <span className="ql-formats">
      <button className="ql-image"/>
      <button className="ql-video"/>
    </span>
      <span className="ql-formats">
      <button className="ql-clean"/>
    </span>
          </span>
        </div>
      </>
  )
      ;
}

export default EditorToolBar;