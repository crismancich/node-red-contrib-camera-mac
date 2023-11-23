// node-red-contrib-camera-mac.js
module.exports = function (RED) {
    function CameraMacNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // Get configuration from the node's properties
        const outputPath = config.outputPath || '/tmp';
        const fileName = config.fileName || 'output.jpg';

        node.on('input', function (msg) {
            // Execute the camera capture command
            const exec = require('child_process').exec;
            const command = `ffmpeg -f avfoundation -framerate 30 -video_size 640x480 -i "0" -vframes 1 ${outputPath}/${fileName}`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    node.error(`Error: ${error.message}`);
                    return;
                }

                // Read the output file as a buffer
                const fs = require('fs');
                const filePath = `${outputPath}/${fileName}`;
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        node.error(`Error reading file: ${err.message}`);
                        return;
                    }

                    // Send the buffer as the node's output
                    msg.payload = data;
                    msg.filePath = filePath; // Add the file path to the message for reference
                    node.send(msg);
                });
            });
        });
    }

    RED.nodes.registerType('camera mac', CameraMacNode, {
        inputs: 0,
        outputs: 1,
        color: '#8dd2fc', // Light Blue color
        category: 'camera',   // Category name
    });
};
