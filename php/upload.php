<?php
    $file_name = explode('!',$_FILES['file']['name']);
    $file_name[0] = $file_name[0]."/".time();
    $file_name = implode('',$file_name);
    $tmp_name = $_FILES['file']['tmp_name'];
    move_uploaded_file($tmp_name, "files/$file_name");
