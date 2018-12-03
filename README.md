# D3 Bullet Chart Extension

This extension allows the user to create a bullet chart in Qlik Sense (using the D3.js library) that allows the user to visualize up to three measures across one or no dimensions.  The linear gauge chart in Qlik Sense only allows for a maximum of two dimensions and does not allow the user to create a bar for each dimension. This project intends to provide the user with a much more extensive ;) charting option.


# Installation

1. Download the extension zip, `qlik-bullet-chart_<version>.zip`, from the latest release(https://github.com/qlik-oss/D3-Bullet-Chart/releases/latest)
2. Install the extension:

   a. **Qlik Sense Desktop**: unzip to a directory under [My Documents]/Qlik/Sense/Extensions.

   b. **Qlik Sense Server**: import the zip file in the QMC.


# Developing the extension

If you want to do code changes to the extension follow these simple steps to get going.

1. Get Qlik Sense Desktop
1. Create a new app and add the extension to a sheet.
2. Clone the repository
3. Run `npm install`
4. Set the environment variable `BUILD_PATH` to your extensions directory. It will be something like `C:/Users/<user>/Documents/Qlik/Sense/Extensions/<extension_name>`.
5. You now have two options. Either run the watch task or the build task. They are explained below. Both of them default to development mode but can be run in production by setting `NODE_ENV=production` before running the npm task.

   a. **Watch**: `npm run watch`. This will start a watcher which will rebuild the extension and output all needed files to the `buildFolder` for each code change you make. See your changes directly in your Qlik Sense app.

   b. **Build**: `npm run build`. If you want to build the extension package. The output zip-file can be found in the `buildFolder`.


# Get started
Launch Qlik Sense and open an app, edit the app, and drag the 'D3 Bullet Chart' Chart Object into the sheet where you'd like it to appear. Add a dimension (optional) and at least one measure.  Under the 'Chart Configuration' menu, there are a number of options to change colors and sizing of the various pieces of the chart.

There is also a sample application, [D3 Bullet Chart Sample App.qvf](resources/D3%20Bullet%20Chart%20Sample%20App.qvf). Copy it into the directory C:\Users\%USERNAME%\Documents\Qlik\Sense\Apps then the application will appear in your Qlik Sense Hub.  This sample app provides examples of how the extension can be altered to provide different looks.

Have fun!


# Examples
Standard example, basic colors with a uniform axis
![First example image](resources/Bullet%20Chart%201.PNG)

Example with altered colors and an independent axis
![Second example image](resources/Bullet%20Chart%202.PNG)

Bullet chart example with no dimensions
![Third example image](resources/Bullet%20Chart%203.PNG)

Two bullet charts with various configuration options shown
![Fourth example image](resources/Bullet%20Chart%204.PNG)


# Resources Used in this Extension

[D3 Bullet Chart by Mike Bostock](http://bl.ocks.org/mbostock/4061961)


# Original authors

[github.com/mcgovey](http://github.com/mcgovey)


# License

Released under the [MIT License](LICENSE).