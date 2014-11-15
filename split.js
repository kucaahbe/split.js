var args = WScript.Arguments;
if (args.length == 0) {
  WScript.Echo("error: please provide filename");
  WScript.Quit(1);
}

var FILENAME = /^\s*([a-z,0-9]+\.xml)\s*$/i;
var FSO = new ActiveXObject("Scripting.FileSystemObject");

var input_file = args(0);
var output_filenames = [];
var target_directory = FSO.GetParentFolderName(FSO.GetAbsolutePathName(input_file));

try {
  var ts = FSO.OpenTextFile(input_file, 1);
  var s,match,current_filename,current_file;
  while (!ts.AtEndOfStream) {
    s = ts.ReadLine();
    match = s.match(FILENAME);
    if (match) {
      current_filename = match[1];
      if (current_filename) {
	current_file && current_file.close();
	current_file = FSO.CreateTextFile(FSO.BuildPath(target_directory, current_filename), true);
	output_filenames.push(current_filename);
      }
    } else if (current_filename) {
      current_file.WriteLine(s);
    }
  }
  current_file && current_file.close();
} catch(e) {
  WScript.Echo(e.message);
  WScript.Quit(1);
} finally {
  if (ts) { ts.Close() }
}

WScript.Echo("Було створено "+output_filenames.length+" файл(и):\n"+output_filenames.join("\n")+"\nв папці "+target_directory);
//vim:shiftwidth=2
