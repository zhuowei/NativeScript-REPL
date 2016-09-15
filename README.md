A REPL for use with Telerik NativeScript's Companion app. Useful for examining UIKit/iOS frameworks without Xcode.

(See https://sites.google.com/site/zhuoweisite/blog/howteleriknativescriptslivesyncworks)

# Usage:

You need Netcat, 7zip, and Python (or any other simple web server)

Go to Mist\MobilePackage\files\app.js and change the IP address to your computer's

Run package.bat to build the REPL. (7zip is required)

Also change test.html to point at the correct IP address.

Start the REPL server on your computer:

`nc -k -l 1337`

Finally, run

`python -m http.server 80`

to serve the package, then go to your IP address in Safari, open test.html, and click on the link.

NativeScript Companion app should LiveSync the REPL to the device, and you should get a connect back JavaScript REPL in the `nc` instace.

# To-do

This whole thing runs in a while(true) loop and completely block the main thread.
May need to move to a separate thread, change to async, or at least yield to main thread once in a while.

Would be nice to support a real debugging protocol in addition to just sending plain text back and forth.