var args = WScript.Arguments;
if (args.length == 0) {
  WScript.Echo("error: please provide filename");
  WScript.Quit(1);
}

var FILENAME = /^\s*([a-z,0-9]+\.xml)\s*$/i;
var fso = new ActiveXObject("Scripting.FileSystemObject");

var input_file = args(0);
try {
  var ts = fso.OpenTextFile(input_file, 1);
  var s,match,current_filename,current_file;
  while (!ts.AtEndOfStream) {
    s = ts.ReadLine();
    match = s.match(FILENAME);
    if (match) {
      current_filename = match[1];
      if (current_filename) {
	current_file && current_file.close();
	WScript.Echo('writing to "'+current_filename+'"');
	current_file = fso.CreateTextFile(current_filename, true);
      }
    } else if (current_filename) {
      current_file.WriteLine(s);
    }
  }
} catch(e) {
  WScript.Echo(e.message);
  WScript.Quit(1);
} finally {
  if (ts) { ts.Close() }
}

WScript.Echo("finished");
//vim:shiftwidth=2
