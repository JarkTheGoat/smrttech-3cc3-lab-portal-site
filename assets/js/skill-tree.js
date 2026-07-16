(function () {
    const STORAGE_PREFIX = 'smrttech-skill-map';

    const documentationTodos = [
        'front-panel',
        'block-diagram',
        'program-elements',
        'data-types',
        'arrays',
        'clusters',
        'dc-circuits',
        'resistor-values',
        'power-rails-common-ground',
        'led-current-limiting',
        'measuring-resistance',
        'measuring-voltage',
        'meter-lead-placement',
        'trainer-board-power',
        'measurement-units',
        'significant-figures',
        'measurement-uncertainty',
        'resistance-to-voltage',
        'sensor-calibration',
        'analog-sensor-signals',
        'threshold-selection',
        'sensor-nonlinearity',
        'arduino-uno-pin-map',
        'analog-to-digital',
        'arduino-variables',
        'setup-function',
        'loop-function',
        'pin-mode',
        'analog-read',
        'digital-write',
        'if-else',
        'threshold-control',
        'predict-build-observe',
        'reading-circuit-diagrams',
        'wiring-map',
        'boundary-testing',
        'simulation-hardware',
        'technical-documentation',
        'source-evaluation',
        'experimental-evidence',
        'safe-bench-practice',
        'thermistor',
        'labview-linx',
        'temperature-conversion',
        'tilt-switch',
        'active-buzzer',
        'pull-down-resistor',
        'event-counting',
        'load-cell',
        'strain-gauge',
        'wheatstone-bridge',
        'op-amp-gain',
        'signal-amplification',
        'servo-motor',
        'potentiometer',
        'pulse-width',
        'servo-pulse-limits',
        'hmi-controls',
        'case-structure',
        'mathscript-node',
        'local-variables',
        'automatic-wave-subvi',
        'stepper-motor',
        'motor-driver',
        'external-motor-power',
        'arduino-ide',
        'serial-communication',
        'visa-serial',
        'command-parsing',
        'thingsboard',
        'mqtt',
        'mqtt-topics',
        'cloud-dashboard',
        'cloud-hmi',
        'ultrasonic-sensor',
        'remote-control',
        'api-token',
        'soil-moisture-sensor',
        'capacitive-sensing',
        'moisture-calibration',
        'percent-moisture',
        'native-labview-calibration',
        'shared-attributes',
        'email-alerts',
        'dashboard-analytics',
        'smart-system-design',
        'project-proposal',
        'project-schematic',
        'project-complexity',
        'demo-video',
        'risk-planning',
        'weekly-progress'
    ];

    // TODO: Add dedicated documentation articles for the ids listed in documentationTodos.
    // Until then, each item links to the nearest canonical article in the existing repository.
    const skillMapData = {
        id: 'course-skill-map',
        title: 'SMRTTECH 3CC3 Cloud Computing and Internet of Things',
        description: 'The course root that connects lab work, reusable knowledge, and professional engineering habits.',
        type: 'Root',
        children: [
            {
                id: 'labview-graphical-programming',
                title: 'LabVIEW and graphical programming',
                description: 'How graphical programs are structured, organized, and reused.',
                type: 'Domain',
                children: [
                    concept('labview-interface', 'LabVIEW interface', 'Recognize the relationship between the front panel and the block diagram.', 'Concept', 'labview-interface', ['Lab 1', 'Lab 2', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'], [], ['front-panel', 'block-diagram'], ['LabVIEW', 'interface']),
                    concept('front-panel', 'Front panel', 'Use the front panel as the user-facing space for controls, indicators, labels, and identity information.', 'Concept', 'labview-interface', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'], ['labview-interface'], ['controls-indicators', 'hmi-controls', 'cloud-hmi'], ['LabVIEW', 'user interface']),
                    concept('block-diagram', 'Block diagram', 'Use the block diagram for dataflow logic, terminals, functions, and structures.', 'Concept', 'labview-interface', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'], ['labview-interface'], ['while-loops', 'for-loops', 'case-structure'], ['LabVIEW', 'dataflow']),
                    concept('program-elements', 'Program elements', 'Identify the objects that make up a LabVIEW program.', 'Reference', 'labview-interface', ['Lab 1', 'Lab 2', 'Lab 5'], ['labview-interface'], ['controls-indicators', 'vi-subvi', 'mathscript-node'], ['LabVIEW', 'programming']),
                    concept('controls-indicators', 'Controls and indicators', 'Distinguish values students enter from values the program displays.', 'Concept', 'controls-indicators', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'], ['front-panel'], ['voltage-divider-vi', 'temperature-conversion', 'hmi-controls', 'cloud-hmi'], ['LabVIEW', 'input', 'output', 'Voltage Reading', 'Angle', 'Speed', 'NumberOfWaves', 'RPM', 'Direction', 'Distance', 'LED', 'Voltage', 'percent_moisture', 'Low Moisture']),
                    concept('vi-subvi', 'VI and SubVI', 'Understand how a LabVIEW program can become a reusable subroutine.', 'Concept', 'vi-subvi', ['Lab 1', 'Lab 2', 'Lab 5'], ['labview-interface'], ['voltage-divider-vi', 'temperature-conversion', 'automatic-wave-subvi'], ['LabVIEW', 'reuse']),
                    concept('hmi-controls', 'HMI controls', 'Use front-panel controls to let a person choose mode and command motion.', 'Skill', 'labview-interface', ['Lab 5', 'Lab 7'], ['front-panel', 'controls-indicators'], ['case-structure', 'servo-motor', 'cloud-hmi'], ['HMI', 'Choice', 'Manual', 'Automatic', 'GO', 'Speed', 'NumberOfWaves', 'Dashboard', 'LED']),
                    concept('case-structure', 'Case Structure', 'Select which LabVIEW logic runs based on a mode such as Manual or Automatic.', 'Skill', 'labview-loops', ['Lab 5'], ['block-diagram', 'controls-indicators'], ['mathscript-node', 'automatic-wave-subvi'], ['Manual', 'Automatic', 'Default', 'Choice']),
                    concept('mathscript-node', 'MathScript Node', 'Use script-style equations inside the existing Lab 5 servo activities for angle, pulse-width, and automatic motion logic.', 'Skill', 'labview-interface', ['Lab 5'], ['program-elements'], ['pulse-width', 'automatic-wave-subvi'], ['MathScript', 'Angle', 'PW', 'URV', 'LRV']),
                    concept('local-variables', 'Local variables', 'Read previous LabVIEW values so automatic motion can continue from its last state.', 'Concept', 'labview-data', ['Lab 5', 'Lab 7', 'Lab 8'], ['block-diagram'], ['automatic-wave-subvi', 'shift-registers', 'mqtt'], ['AngleLast', 'DirectionLast', 'WaveCountLast', 'WavingLast', 'Distance', 'RX Value', 'percent_moisture', 'moisture_threshold']),
                    concept('automatic-wave-subvi', 'Automatic-wave SubVI', 'Generate a reusable waving angle command from GO, Speed, and NumberOfWaves.', 'Skill', 'vi-subvi', ['Lab 5'], ['vi-subvi', 'local-variables', 'mathscript-node'], ['servo-motor', 'pulse-width'], ['Wave Servo', 'waving', 'robot arm']),
                    concept('temperature-conversion', 'Temperature conversion VI', 'Convert Celsius values into Fahrenheit or Kelvin using LabVIEW arithmetic and reusable SubVIs.', 'Skill', 'vi-subvi', ['Lab 2'], ['controls-indicators', 'vi-subvi'], ['thermistor', 'labview-linx'], ['Celsius', 'Fahrenheit', 'Kelvin', 'SubVI']),
                    concept('data-types', 'Data types', 'Recognize that wires carry specific kinds of information such as numeric, Boolean, or string values.', 'Concept', 'labview-data', ['Lab 1'], ['program-elements'], ['arrays', 'clusters'], ['LabVIEW', 'wires']),
                    concept('arrays', 'Arrays', 'Store repeated values of the same type, such as a set of voltage measurements.', 'Concept', 'labview-data', ['Lab 1'], ['data-types'], ['measurement-units'], ['LabVIEW', 'data organization']),
                    concept('clusters', 'Clusters', 'Group related values, potentially of different types, into a single structured item.', 'Concept', 'labview-data', ['Lab 1'], ['data-types'], ['technical-documentation'], ['LabVIEW', 'data organization']),
                    concept('while-loops', 'While loops', 'Repeat logic until a condition such as a Stop button is met.', 'Skill', 'labview-loops', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'], ['block-diagram'], ['shift-registers'], ['LabVIEW', 'program flow']),
                    concept('for-loops', 'For loops', 'Repeat logic a known number of times.', 'Skill', 'labview-loops', ['Lab 1'], ['block-diagram'], ['arrays'], ['LabVIEW', 'program flow']),
                    concept('shift-registers', 'Shift registers', 'Carry a value from one loop iteration to the next.', 'Skill', 'labview-loops', ['Lab 1', 'Lab 3'], ['while-loops'], ['sensor-calibration', 'event-counting'], ['LabVIEW', 'memory']),
                    concept('voltage-divider-vi', 'Voltage-divider VI', 'Implement the voltage-divider relationship as an interactive LabVIEW calculation.', 'Skill', 'voltage-divider', ['Lab 1'], ['controls-indicators', 'while-loops', 'voltage-divider'], ['calculated-measured'], ['LabVIEW', 'voltage divider'])
                ]
            },
            {
                id: 'circuits-components',
                title: 'Circuits and components',
                description: 'Electrical foundations for building and interpreting sensor circuits.',
                type: 'Domain',
                children: [
                    concept('dc-circuits', 'DC circuit fundamentals', 'Understand source, load, path, and reference in a direct-current circuit.', 'Concept', 'voltage-divider', ['Lab 1'], [], ['voltage-divider', 'power-rails-common-ground'], ['circuit', 'DC']),
                    concept('voltage-divider', 'Voltage dividers', 'Convert resistor relationships into a measurable output voltage.', 'Concept', 'voltage-divider', ['Lab 1', 'Lab 2'], ['dc-circuits', 'resistor-values'], ['photoresistor', 'thermistor', 'analog-input', 'calculated-measured'], ['Vout', 'R1', 'R2']),
                    concept('resistor-values', 'Resistor values and units', 'Use ohms, kilo-ohms, and component values consistently.', 'Reference', 'resistors-led', ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4'], ['dc-circuits'], ['measurement-units', 'led-current-limiting', 'pull-down-resistor', 'op-amp-gain'], ['ohm', 'kOhm', 'MOhm', '4.7', '10 kOhm', '100 kOhm', '1 MOhm']),
                    concept('breadboard', 'Breadboard connectivity', 'Understand how connected rows, separated halves, and component placement affect wiring.', 'Tool', 'breadboard', ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'], ['dc-circuits'], ['wiring-map', 'systematic-troubleshooting'], ['breadboard', 'Tinkercad']),
                    concept('power-rails-common-ground', 'Power rails and common ground', 'Provide a shared voltage reference so measurements and signals make sense.', 'Concept', 'breadboard', ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'], ['dc-circuits'], ['analog-input', 'systematic-troubleshooting', 'ms15-interface', 'external-motor-power'], ['ground', 'GND', 'rails', '0 V reference']),
                    concept('external-motor-power', 'External motor power', 'Use a separate regulated motor supply when actuator current exceeds what Arduino should provide.', 'Practice', 'breadboard', ['Lab 6'], ['power-rails-common-ground', 'safe-bench-practice'], ['motor-driver', 'stepper-motor'], ['external power', '9 V', '5 V rail', 'breadboard power supply']),
                    concept('pull-down-resistor', 'Pull-down resistor', 'Hold a digital input LOW when a switch is open so the input does not float.', 'Concept', 'breadboard', ['Lab 3'], ['resistor-values', 'power-rails-common-ground'], ['tilt-switch', 'digital-input'], ['floating input', '10 kOhm', 'digital logic']),
                    concept('led-polarity', 'LED polarity', 'Orient the LED correctly so current can flow in the intended direction.', 'Concept', 'resistors-led', ['Lab 1'], ['dc-circuits'], ['led-current-limiting', 'digital-output'], ['LED', 'anode', 'cathode']),
                    concept('led-current-limiting', 'LED current-limiting resistors', 'Protect the LED by limiting current in the output path.', 'Concept', 'resistors-led', ['Lab 1', 'Lab 7'], ['resistor-values', 'led-polarity'], ['digital-output', 'remote-control'], ['220 ohm', 'resistor'])
                ]
            },
            {
                id: 'measurement-instrumentation',
                title: 'Measurement and instrumentation',
                description: 'How students collect, compare, and interpret electrical evidence.',
                type: 'Domain',
                children: [
                    concept('multimeter', 'Multimeter setup', 'Select the correct meter mode and lead placement before measuring.', 'Tool', 'multimeter', ['Lab 1'], ['dc-circuits'], ['measuring-resistance', 'measuring-voltage'], ['meter', 'DMM']),
                    concept('measuring-resistance', 'Measuring resistance safely', 'Measure resistance on an unpowered circuit or isolated component.', 'Skill', 'multimeter', ['Lab 1'], ['multimeter'], ['photoresistor', 'safe-bench-practice'], ['ohms', 'unpowered']),
                    concept('measuring-voltage', 'Measuring voltage', 'Measure powered circuit voltage between nodes or between a node and reference ground.', 'Skill', 'multimeter', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 8'], ['multimeter', 'power-rails-common-ground'], ['analog-input', 'sampled-data', 'signal-amplification', 'moisture-calibration'], ['volts', 'Vout', 'wiper voltage', 'SIG+', 'SIG-', 'V2', 'V3', 'A0', 'V_dry', 'V_wet']),
                    concept('meter-lead-placement', 'Meter lead placement', 'Place meter leads according to the quantity being measured.', 'Skill', 'multimeter', ['Lab 1'], ['multimeter'], ['systematic-troubleshooting'], ['red lead', 'black lead']),
                    concept('trainer-board-power', 'Trainer-board power supply', 'Use the trainer-board 5 V supply for real hardware verification.', 'Tool', 'breadboard', ['Lab 1'], ['power-rails-common-ground'], ['safe-bench-practice'], ['trainer board', '5 V']),
                    concept('measurement-units', 'Measurement units', 'Record values with clear units so comparisons are meaningful.', 'Reference', 'measurement', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 8'], ['resistor-values'], ['significant-figures'], ['units', 'degrees', 'microseconds', 'percent moisture']),
                    concept('significant-figures', 'Significant figures', 'Report values with reasonable precision for the instrument and experiment.', 'Reference', 'measurement', ['Lab 1'], ['measurement-units'], ['measurement-uncertainty'], ['precision']),
                    concept('calculated-measured', 'Calculated versus measured values', 'Compare ideal calculations with physical measurements and explain disagreement.', 'Concept', 'measurement', ['Lab 1'], ['voltage-divider', 'measuring-voltage'], ['percent-difference', 'measurement-uncertainty'], ['calculation', 'measurement']),
                    concept('percent-difference', 'Percent difference', 'Quantify the difference between a measured and calculated value.', 'Skill', 'measurement', ['Lab 1'], ['calculated-measured'], ['experimental-evidence'], ['percent error']),
                    concept('measurement-uncertainty', 'Measurement uncertainty', 'Recognize tolerance, sensor variability, and instrument limits in experimental evidence.', 'Concept', 'measurement', ['Lab 1', 'Lab 2', 'Lab 4'], ['calculated-measured', 'significant-figures'], ['source-evaluation'], ['uncertainty', 'tolerance', 'noise', 'offset']),
                    concept('sampled-data', 'Sampled data in time', 'Record physical signals as timestamped data so rate, duration, and observed change can be interpreted.', 'Concept', 'measurement', ['Lab 2'], ['measuring-voltage', 'analog-to-digital'], ['experimental-evidence', 'sensor-calibration'], ['LabVIEW', 'LINX', 'timestamp', 'sample rate', 'time vector'])
                ]
            },
            {
                id: 'sensors-interfaces',
                title: 'Sensors and interfaces',
                description: 'How physical conditions become electrical signals and decisions.',
                type: 'Domain',
                children: [
                    concept('photoresistor', 'Photoresistor behaviour', 'Use light-dependent resistance as the sensing mechanism.', 'Concept', 'photoresistor', ['Lab 1'], ['measuring-resistance'], ['voltage-divider', 'sensor-nonlinearity'], ['light', 'LDR']),
                    concept('thermistor', 'Thermistor behaviour', 'Use temperature-dependent resistance as the sensing mechanism.', 'Concept', 'photoresistor', ['Lab 2'], ['measuring-resistance'], ['voltage-divider', 'temperature-conversion', 'sensor-nonlinearity'], ['temperature', 'thermistor', 'NTC']),
                    concept('tilt-switch', 'Tilt ball switch', 'Detect orientation as an open or closed digital switch state.', 'Concept', 'analog-digital', ['Lab 3'], ['power-rails-common-ground', 'pull-down-resistor'], ['digital-input', 'event-counting'], ['tilt', 'open circuit', 'short circuit', 'HIGH', 'LOW']),
                    concept('load-cell', 'Load cell', 'Convert applied force into a tiny electrical bridge signal through strain.', 'Concept', 'measurement', ['Lab 4'], ['measuring-voltage'], ['strain-gauge', 'wheatstone-bridge', 'signal-amplification'], ['force', 'load cell', 'SIG+', 'SIG-']),
                    concept('strain-gauge', 'Strain gauge', 'Change resistance when deformation stretches or compresses the sensing element.', 'Concept', 'measurement', ['Lab 4'], ['load-cell'], ['wheatstone-bridge'], ['strain', 'resistance change', 'pressure transducer']),
                    concept('wheatstone-bridge', 'Wheatstone Bridge', 'Convert small resistance changes into a measurable differential voltage.', 'Concept', 'measurement', ['Lab 4'], ['strain-gauge', 'resistor-values'], ['signal-amplification'], ['bridge', 'differential voltage', 'SIG+', 'SIG-']),
                    concept('signal-amplification', 'Signal amplification', 'Increase tiny sensor voltages so Arduino analog input can use more of its measurement range.', 'Concept', 'analog-digital', ['Lab 4'], ['wheatstone-bridge', 'measuring-voltage'], ['op-amp-gain', 'analog-input'], ['amplifier', 'V2', 'V3', 'LMC6484']),
                    concept('resistance-to-voltage', 'Resistance-to-voltage conversion', 'Use a divider to convert resistance changes into voltage changes.', 'Concept', 'voltage-divider', ['Lab 1', 'Lab 2'], ['photoresistor', 'thermistor', 'voltage-divider'], ['analog-input'], ['sensor interface']),
                    concept('sensor-calibration', 'Sensor calibration', 'Choose a threshold or mapping using measured sensor readings and operating conditions.', 'Skill', 'photoresistor', ['Lab 1', 'Lab 2'], ['analog-sensor-signals'], ['threshold-selection', 'sampled-data', 'temperature-conversion'], ['calibration', 'mapping']),
                    concept('potentiometer', 'Potentiometer', 'Create a variable voltage from a physical rotation command.', 'Tool', 'analog-digital', ['Lab 5'], ['power-rails-common-ground'], ['analog-input', 'servo-motor'], ['potentiometer', 'wiper', 'middle terminal', 'manual control']),
                    concept('servo-motor', 'Servo motor', 'Interpret a pulse-width command as a target shaft position.', 'Tool', 'analog-digital', ['Lab 5'], ['power-rails-common-ground', 'digital-output'], ['pulse-width', 'servo-pulse-limits', 'automatic-wave-subvi'], ['servo', 'brown red orange', 'horn', 'coupling', 'motion']),
                    concept('stepper-motor', 'Stepper motor', 'Move in discrete increments by energizing windings in sequence and holding position with energized coils.', 'Tool', 'analog-digital', ['Lab 6'], ['external-motor-power', 'motor-driver'], ['command-parsing', 'actuator-command'], ['stepper', 'holding torque', 'steps per revolution', '2048', 'micro-stepping']),
                    concept('motor-driver', 'Stepper motor driver', 'Switch motor coils and supply motor current from the external power circuit under Arduino control.', 'Tool', 'analog-digital', ['Lab 6'], ['external-motor-power', 'digital-output'], ['stepper-motor', 'safe-bench-practice'], ['IN1', 'IN2', 'IN3', 'IN4', 'driver']),
                    concept('ultrasonic-sensor', 'HC-SR04 ultrasonic sensor', 'Measure distance by sending a pulse on Trig and timing the returned Echo signal.', 'Tool', 'analog-digital', ['Lab 7'], ['power-rails-common-ground', 'digital-output'], ['sampled-data', 'cloud-hmi'], ['ultrasonic', 'HC-SR04', 'Trig', 'Echo', 'distance']),
                    concept('soil-moisture-sensor', 'Capacitive soil moisture sensor', 'Respond to moisture around the probe and produce an analog voltage for Arduino A0.', 'Tool', 'analog-digital', ['Lab 8'], ['power-rails-common-ground', 'analog-input'], ['capacitive-sensing', 'moisture-calibration', 'percent-moisture'], ['soil moisture', 'SEN0193', 'SIG', 'A0', 'plant monitoring']),
                    concept('capacitive-sensing', 'Capacitive sensing', 'Infer moisture from changes in capacitance rather than current through exposed resistive probes.', 'Concept', 'analog-digital', ['Lab 8'], ['soil-moisture-sensor'], ['source-evaluation', 'measurement-uncertainty'], ['capacitive', 'resistive', 'corrosion', 'dielectric']),
                    concept('moisture-calibration', 'Dry/wet moisture calibration', 'Measure V_dry and V_wet so this sensor setup maps voltage to 0-100 percent moisture.', 'Skill', 'measurement', ['Lab 8'], ['measuring-voltage', 'soil-moisture-sensor'], ['percent-moisture', 'native-labview-calibration'], ['V_dry', 'V_wet', 'calibration', 'water cup']),
                    concept('percent-moisture', 'Percent moisture', 'Convert calibrated voltage into a bounded 0-100 moisture value for cloud display and logic.', 'Concept', 'measurement', ['Lab 8'], ['moisture-calibration'], ['threshold-control', 'cloud-dashboard'], ['percent_moisture', 'clamp', '0 to 100']),
                    concept('analog-sensor-signals', 'Analog sensor signals', 'Treat sensor output as a range of values rather than only on or off.', 'Concept', 'analog-digital', ['Lab 1', 'Lab 2', 'Lab 5', 'Lab 8'], ['resistance-to-voltage'], ['analog-input', 'sampled-data', 'potentiometer', 'soil-moisture-sensor'], ['analog', 'potentiometer', 'thermistor', 'soil moisture']),
                    concept('threshold-selection', 'Threshold selection', 'Choose the comparison value that separates desired operating states.', 'Skill', 'arduino-code', ['Lab 1'], ['sensor-calibration', 'analog-input'], ['threshold-control'], ['lowLightLim', '400']),
                    concept('sensor-nonlinearity', 'Sensor response and nonlinearity', 'Recognize that sensor readings may not change evenly across all operating ranges.', 'Concept', 'photoresistor', ['Lab 1', 'Lab 2'], ['photoresistor', 'thermistor'], ['measurement-uncertainty'], ['nonlinear']),
                    concept('ms15-interface', 'MS15 interface signals', 'Identify MS15 power rails, 0 V references, position feedback, tachogenerator feedback, and motor-drive command before wiring.', 'Reference', 'breadboard', [], ['power-rails-common-ground', 'safe-bench-practice'], ['sensor-calibration', 'actuator-command'], ['MS15', 'tachogenerator', 'position potentiometer', 'motor drive'])
                ]
            },
            {
                id: 'arduino-embedded-programming',
                title: 'Arduino and embedded programming',
                description: 'How microcontroller pins, readings, and code create automatic behavior.',
                type: 'Domain',
                children: [
                    concept('arduino-uno-pin-map', 'Arduino Uno pin map', 'Identify power, ground, analog input, and digital output pins.', 'Reference', 'analog-digital', ['Lab 1'], ['power-rails-common-ground'], ['analog-input', 'digital-output'], ['Arduino Uno', 'pins']),
                    concept('analog-input', 'Analog input', 'Read a changing voltage with an analog input such as A0.', 'Concept', 'analog-digital', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 8'], ['voltage-divider', 'analog-sensor-signals'], ['analog-to-digital', 'arduino-code-flow', 'labview-linx', 'signal-amplification', 'potentiometer', 'soil-moisture-sensor'], ['A0', 'LabVIEW', 'LINX', 'V3', 'SIG']),
                    concept('digital-output', 'Digital output', 'Command an output pin as LOW or HIGH or as a timed control signal.', 'Concept', 'analog-digital', ['Lab 1', 'Lab 3', 'Lab 5', 'Lab 6', 'Lab 7'], ['led-current-limiting'], ['digital-write', 'pwm-output', 'active-buzzer', 'servo-motor', 'motor-driver', 'remote-control'], ['D7', 'pin 7', 'LED', 'D3', 'servo signal', 'D8', 'D9', 'D10', 'D11', 'D12']),
                    concept('digital-input', 'Digital input', 'Read a defined HIGH or LOW state from a switch circuit.', 'Concept', 'analog-digital', ['Lab 3'], ['pull-down-resistor'], ['tilt-switch', 'event-counting'], ['D2', 'HIGH', 'LOW', 'switch']),
                    concept('analog-to-digital', 'Analog-to-digital conversion', 'Convert a voltage range into a numeric reading.', 'Concept', 'analog-digital', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5'], ['analog-input'], ['threshold-selection', 'sampled-data'], ['ADC', '0 to 1023', 'voltage to number']),
                    concept('op-amp-gain', 'Op-amp gain', 'Use resistor ratios and feedback to set first-stage and second-stage signal gain.', 'Skill', 'analog-digital', ['Lab 4'], ['resistor-values', 'signal-amplification'], ['analog-input'], ['LMC6484', 'gain', 'R3 R1', 'R6 R5', 'saturation']),
                    concept('labview-linx', 'LabVIEW LINX communication', 'Use LINX firmware and blocks so LabVIEW can exchange sensor data and commands with Arduino.', 'Tool', 'analog-digital', ['Lab 2', 'Lab 4', 'Lab 5', 'Lab 7', 'Lab 8'], ['technical-documentation', 'safe-bench-practice'], ['analog-input', 'temperature-conversion', 'servo-motor', 'ultrasonic-sensor', 'soil-moisture-sensor'], ['LINX', 'firmware', 'serial port', 'Arduino Mega', 'Servo Open', 'Servo Close', 'Digital Write', 'Analog Read']),
                    concept('matlab-hardware-connection', 'MATLAB hardware connection', 'Confirm MATLAB can identify supported hardware before wiring sensors or actuators.', 'Tool', 'analog-digital', [], ['technical-documentation', 'safe-bench-practice'], ['analog-input', 'digital-output'], ['MATLAB', 'hardware setup', 'port', 'support package']),
                    concept('arduino-ide', 'Arduino IDE firmware upload', 'Compile and upload Arduino code that reads serial commands and actuates hardware.', 'Tool', 'arduino-code', ['Lab 6'], ['technical-documentation', 'safe-bench-practice'], ['serial-communication', 'command-parsing'], ['Arduino IDE', 'Verify', 'Upload', 'Stepper.h', 'firmware']),
                    concept('serial-communication', 'Serial communication', 'Exchange text commands between a computer program and Arduino over a COM port.', 'Concept', 'analog-digital', ['Lab 6'], ['arduino-ide'], ['visa-serial', 'command-parsing'], ['serial', 'COM port', '9600 baud', 'Serial Monitor']),
                    concept('visa-serial', 'VISA Serial in LabVIEW', 'Configure, write to, and close a serial port from LabVIEW.', 'Tool', 'labview-interface', ['Lab 6'], ['serial-communication', 'labview-interface'], ['command-parsing', 'actuator-command'], ['VISA', 'Configure Port', 'Write', 'Close', 'Sent Msg']),
                    concept('command-parsing', 'Command parsing', 'Split a delimited command string into speed, distance, and direction fields.', 'Skill', 'arduino-code', ['Lab 6'], ['serial-communication', 'arduino-variables'], ['stepper-motor'], ['comma', 'delimiter', 'substring', 'indexOf', 'RPM']),
                    concept('thingsboard', 'ThingsBoard Cloud platform', 'Create one device per physical project, publish JSON telemetry, use shared attributes for desired state, and build dashboards.', 'Tool', 'deployment', ['Lab 7', 'Lab 8'], ['technical-documentation'], ['mqtt', 'cloud-dashboard', 'api-token', 'shared-attributes'], ['ThingsBoard', 'device', 'telemetry', 'shared attributes', 'distance_cm', 'led_switch', 'moisture_percent', 'moisture_threshold']),
                    concept('mqtt', 'MQTT publish and subscribe', 'Exchange messages through a broker using publish topics and subscribe topics.', 'Concept', 'analog-digital', ['Lab 7', 'Lab 8'], ['serial-communication'], ['mqtt-topics', 'cloud-hmi', 'remote-control'], ['MQTT', 'broker', 'publish', 'subscribe', 'mqtt.thingsboard.cloud', '1883', '8883']),
                    concept('mqtt-topics', 'ThingsBoard MQTT topic structure', 'Publish JSON telemetry and receive or request shared attributes using exact topic paths with no leading slash.', 'Reference', 'analog-digital', ['Lab 7', 'Lab 8'], ['mqtt', 'thingsboard'], ['api-token', 'systematic-troubleshooting'], ['v1/devices/me/telemetry', 'v1/devices/me/attributes', 'v1/devices/me/attributes/response/+', 'v1/devices/me/attributes/request/1']),
                    concept('api-token', 'ThingsBoard device access-token handling', 'Use the device access token as the MQTT username without exposing it in public files, screenshots, or completion exports.', 'Practice', 'deployment', ['Lab 7', 'Lab 8'], ['source-evaluation'], ['thingsboard', 'safe-bench-practice'], ['device access token', 'credentials', 'username', 'security']),
                    concept('cloud-dashboard', 'ThingsBoard dashboard widgets', 'Visualize telemetry keys and write persistent desired-state values as shared attributes.', 'Tool', 'deployment', ['Lab 7', 'Lab 8'], ['thingsboard', 'mqtt'], ['cloud-hmi', 'remote-control', 'dashboard-analytics'], ['dashboard', 'entity alias', 'gauge', 'time series', 'control switch', 'shared attribute']),
                    concept('cloud-hmi', 'Cloud-based HMI', 'Use a web interface to monitor local sensor data and command local settings or actuators.', 'Concept', 'labview-interface', ['Lab 7', 'Lab 8'], ['hmi-controls', 'cloud-dashboard'], ['remote-control', 'ultrasonic-sensor', 'soil-moisture-sensor'], ['web HMI', 'dashboard', 'monitoring', 'control', 'threshold']),
                    concept('shared-attributes', 'ThingsBoard shared attributes', 'Use persistent cloud-to-device configuration for led_switch and moisture_threshold, including startup requests after reconnecting.', 'Tool', 'deployment', ['Lab 7', 'Lab 8'], ['thingsboard', 'mqtt'], ['remote-control', 'threshold-control'], ['shared attribute', 'desired state', 'led_switch', 'moisture_threshold', 'attributes/response/+']),
                    concept('email-alerts', 'Optional ThingsBoard alarm history', 'Display or retain alarm history as an optional cloud view while keeping the primary moisture decision local in LabVIEW.', 'Practice', 'deployment', ['Lab 8'], ['shared-attributes'], ['source-evaluation'], ['alarm history', 'event history', 'low_moisture_alarm']),
                    concept('dashboard-analytics', 'Dashboard analytics widgets', 'Display current and historical ThingsBoard telemetry without moving the primary alarm decision out of LabVIEW.', 'Reference', 'measurement', ['Lab 8'], ['cloud-dashboard', 'percent-moisture'], ['experimental-evidence'], ['time series', 'latest value', 'alarm indicator', 'history']),
                    concept('native-labview-calibration', 'Native LabVIEW moisture calibration', 'Implement dry/wet scaling, 0-100 clamping, threshold comparison, and Boolean alarm logic with native arithmetic and comparison functions.', 'Skill', 'labview-interface', ['Lab 8'], ['moisture-calibration'], ['percent-moisture', 'threshold-control'], ['native arithmetic', 'comparison', 'Boolean', 'V_dry', 'V_wet', 'low_moisture_alarm']),
                    concept('remote-control', 'Remote actuator control', 'Trace how the desired led_switch shared attribute becomes a local digital output and how actual led_state returns as telemetry.', 'Skill', 'troubleshooting', ['Lab 7'], ['digital-output', 'mqtt'], ['actuator-command', 'threshold-control'], ['led_switch', 'led_state', 'shared attribute', 'Digital Write', 'LED']),
                    concept('arduino-variables', 'Arduino variables', 'Store pin numbers, sensor readings, and thresholds in named values.', 'Skill', 'arduino-code', ['Lab 1'], ['arduino-code-flow'], ['threshold-control'], ['int', 'variables']),
                    concept('setup-function', 'setup()', 'Run configuration code once when the Arduino starts.', 'Reference', 'arduino-code', ['Lab 1'], ['arduino-code-flow'], ['pin-mode'], ['setup']),
                    concept('loop-function', 'loop()', 'Repeat sensing and decision logic continuously.', 'Reference', 'arduino-code', ['Lab 1'], ['arduino-code-flow'], ['analog-read', 'if-else'], ['loop']),
                    concept('pin-mode', 'pinMode()', 'Configure a digital pin as an input or output.', 'Reference', 'arduino-code', ['Lab 1'], ['setup-function'], ['digital-output'], ['pinMode']),
                    concept('analog-read', 'analogRead()', 'Read the analog sensor value from A0.', 'Reference', 'arduino-code', ['Lab 1'], ['loop-function', 'analog-input'], ['threshold-selection'], ['analogRead']),
                    concept('digital-write', 'digitalWrite()', 'Command the LED output as HIGH or LOW.', 'Reference', 'arduino-code', ['Lab 1'], ['digital-output'], ['threshold-control'], ['digitalWrite']),
                    concept('active-buzzer', 'Active buzzer', 'Produce an audible alert when a digital output drives the buzzer input HIGH with correct polarity.', 'Tool', 'analog-digital', ['Lab 3'], ['digital-output', 'safe-bench-practice'], ['event-counting'], ['buzzer', 'alarm', 'D3']),
                    concept('if-else', 'if/else', 'Choose one of two actions based on a Boolean condition.', 'Reference', 'arduino-code', ['Lab 1'], ['loop-function'], ['threshold-control'], ['if', 'else']),
                    concept('threshold-control', 'Threshold-based control', 'Turn a sensor reading into a local decision and actuator or alarm state.', 'Skill', 'arduino-code', ['Lab 1', 'Lab 7', 'Lab 8'], ['threshold-selection', 'if-else'], ['boundary-testing', 'remote-control', 'shared-attributes'], ['automatic lighting', 'distance less than 5 cm', 'moisture_percent less than moisture_threshold']),
                    concept('event-counting', 'Event counting with shift registers', 'Count a transition once by comparing current and previous digital states.', 'Skill', 'labview-loops', ['Lab 3'], ['shift-registers', 'digital-input'], ['systematic-troubleshooting'], ['state', 'event', 'transition', 'Not Equal', 'Boolean To 1 0']),
                    concept('pwm-output', 'PWM output', 'Command apparent output intensity or servo position by switching between low and high states with timing constraints.', 'Concept', 'analog-digital', ['Lab 5'], ['digital-output'], ['actuator-command', 'measurement-uncertainty', 'pulse-width'], ['PWM', 'duty cycle', 'oscilloscope', 'multimeter']),
                    concept('pulse-width', 'Servo pulse width', 'Map a command angle into a timed servo pulse measured in microseconds.', 'Concept', 'analog-digital', ['Lab 5'], ['servo-motor', 'mathscript-node'], ['servo-pulse-limits', 'pwm-output'], ['pulse width', 'microseconds', '1500', '600', '2400', 'PW']),
                    concept('servo-pulse-limits', 'Servo pulse-width limits', 'Confirm safe lower and upper pulse-width values for the actual servo before testing extremes.', 'Practice', 'troubleshooting', ['Lab 5'], ['pulse-width', 'safe-bench-practice'], ['systematic-troubleshooting'], ['LRV', 'URV', 'jitter', 'mechanical limit'])
                ]
            },
            {
                id: 'engineering-practice',
                title: 'Engineering practice',
                description: 'Habits and strategies for working safely, documenting evidence, and learning independently.',
                type: 'Domain',
                children: [
                    concept('predict-build-observe', 'Predict, build, observe, explain, verify', 'Use a repeatable learning cycle for software, simulation, and hardware work.', 'Practice', 'troubleshooting', ['Lab 1', 'Lab 2'], [], ['experimental-evidence'], ['learning cycle', 'predict build measure explain revise']),
                    concept('reading-circuit-diagrams', 'Reading circuit diagrams', 'Translate a schematic into components, nodes, and a physical wiring plan.', 'Skill', 'voltage-divider', ['Lab 1'], ['dc-circuits'], ['wiring-map'], ['schematic']),
                    concept('wiring-map', 'Following a wiring map', 'Translate breadboard coordinates into physical connections.', 'Skill', 'breadboard', ['Lab 1'], ['breadboard', 'reading-circuit-diagrams'], ['systematic-troubleshooting'], ['G8', 'J7', 'A0']),
                    concept('boundary-testing', 'Boundary-condition testing', 'Test behavior around a threshold or limit rather than only at obvious cases.', 'Practice', 'arduino-code', ['Lab 1'], ['threshold-control'], ['experimental-evidence'], ['testing']),
                    concept('systematic-troubleshooting', 'Systematic troubleshooting', 'Use a safe, repeatable sequence to isolate wiring, measurement, and code faults.', 'Practice', 'troubleshooting', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8'], ['multimeter', 'breadboard'], ['led-polarity', 'if-else', 'power-rails-common-ground', 'labview-linx', 'servo-pulse-limits', 'visa-serial', 'mqtt-topics', 'moisture-calibration'], ['debugging']),
                    concept('simulation-hardware', 'Comparing simulation and hardware', 'Use simulation to reason, then verify results with real components and measurements.', 'Practice', 'tinkercad', ['Lab 1'], ['tinkercad'], ['measurement-uncertainty'], ['simulation', 'hardware']),
                    concept('technical-documentation', 'Technical documentation use', 'Use course notes and references to find exact procedures and constraints.', 'Reference', 'deployment', ['Labs 1-8', 'Design Project'], [], ['source-evaluation', 'project-proposal'], ['documentation']),
                    concept('source-evaluation', 'Source evaluation', 'Judge whether a source is appropriate, authoritative, and applicable to the current problem.', 'Practice', 'deployment', ['Labs 7-8', 'Design Project'], ['technical-documentation'], ['safe-bench-practice'], ['datasheets', 'manufacturer']),
                    concept('experimental-evidence', 'Experimental evidence', 'Support claims with measurements, observations, calculations, and demonstrations.', 'Practice', 'measurement', ['Lab 1', 'Lab 2', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8', 'Design Project'], ['measurement-units'], ['source-evaluation', 'dashboard-analytics', 'demo-video'], ['evidence']),
                    concept('safe-bench-practice', 'Safe bench practice', 'Work with power, meters, wiring, water, and moving parts in a controlled and low-risk sequence.', 'Practice', 'troubleshooting', ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5', 'Lab 6', 'Lab 7', 'Lab 8', 'Design Project'], ['multimeter'], ['trainer-board-power', 'ms15-interface', 'labview-linx', 'active-buzzer', 'signal-amplification', 'servo-motor', 'external-motor-power', 'api-token', 'soil-moisture-sensor', 'risk-planning'], ['safety', 'water near electronics']),
                    concept('actuator-command', 'Actuator command path', 'Trace how a number in software becomes a bounded physical output command.', 'Practice', 'troubleshooting', ['Lab 5', 'Lab 6', 'Lab 7', 'Design Project'], ['pwm-output', 'safe-bench-practice'], ['open-loop-control', 'ms15-interface', 'servo-motor', 'stepper-motor', 'remote-control', 'smart-system-design'], ['actuator', 'command', 'sense decide act']),
                    concept('smart-system-design', 'Smart-system design', 'Combine a real-world purpose, sensors, decision logic, actuators, local HMI, cloud features, and web HMI into one prototype.', 'Practice', 'deployment', ['Design Project'], ['experimental-evidence', 'actuator-command', 'cloud-hmi'], ['project-complexity', 'project-proposal', 'risk-planning'], ['design project', 'prototype', 'two sensors', 'one actuator', 'local HMI', 'web HMI', 'cloud']),
                    concept('project-proposal', 'Project proposal', 'Communicate the smart-system purpose, functionality, components, schematic, and weekly schedule in 2-3 pages.', 'Practice', 'deployment', ['Design Project'], ['technical-documentation', 'smart-system-design'], ['project-schematic', 'weekly-progress'], ['abstract', 'proposal', 'component list', 'timeline', 'EasyEDA']),
                    concept('project-schematic', 'Project schematic', 'Show the electrical connections clearly enough for the team and instructor to reason about the build.', 'Skill', 'breadboard', ['Design Project'], ['reading-circuit-diagrams', 'project-proposal'], ['systematic-troubleshooting', 'risk-planning'], ['schematic', 'wiring map', 'connections', 'EasyEDA']),
                    concept('project-complexity', 'Project complexity planning', 'Balance scope so the project is comparable to about three combined labs without becoming too small or too large.', 'Practice', 'troubleshooting', ['Design Project'], ['smart-system-design'], ['risk-planning', 'weekly-progress'], ['complexity', 'scope', 'approval', 'six devices']),
                    concept('demo-video', 'Demo and video communication', 'Show functionality, describe hardware, describe software, and explain evidence clearly in the final demo and 3-4 minute video.', 'Practice', 'measurement', ['Design Project'], ['experimental-evidence'], ['source-evaluation'], ['demo', 'video', 'rubric', 'functionality', 'hardware', 'software']),
                    concept('risk-planning', 'Risk planning', 'Identify technical, schedule, safety, and scope risks before they block the final demonstration.', 'Practice', 'troubleshooting', ['Design Project'], ['systematic-troubleshooting', 'safe-bench-practice'], ['project-complexity', 'weekly-progress'], ['risk', 'fallback', 'troubleshooting', 'instructor approval']),
                    concept('weekly-progress', 'Weekly progress tracking', 'Use weekly goals and instructor feedback to keep hardware, software, cloud, and HMI integration moving.', 'Practice', 'deployment', ['Design Project'], ['project-proposal'], ['risk-planning', 'demo-video'], ['attendance', 'progress', 'week 1', 'week 2', 'week 3']),
                    concept('open-loop-control', 'Open-loop versus closed-loop control', 'Decide whether measured output is fed back to revise the next command.', 'Concept', 'troubleshooting', [], ['actuator-command', 'experimental-evidence'], ['systematic-troubleshooting', 'smart-system-design'], ['open-loop', 'closed-loop', 'feedback'])
                ]
            }
        ]
    };

    function concept(id, title, description, type, docAnchor, usedInLabs, prerequisites, related, keywords) {
        return {
            id,
            title,
            description,
            type,
            docAnchor,
            usedInLabs,
            prerequisites,
            related,
            keywords,
            children: []
        };
    }

    const nodeLookup = new Map();
    skillMapData.children.forEach(domain => {
        nodeLookup.set(domain.id, domain);
        domain.children.forEach(child => nodeLookup.set(child.id, child));
    });

    function storageKey(name) {
        return `${STORAGE_PREFIX}:${name}`;
    }

    function getStoredSet(name) {
        try {
            return new Set(JSON.parse(localStorage.getItem(storageKey(name)) || '[]'));
        } catch {
            return new Set();
        }
    }

    function setStoredSet(name, values) {
        localStorage.setItem(storageKey(name), JSON.stringify([...values]));
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function getDocHref(node, docPath) {
        const path = docPath || 'knowledge/index.html';
        return `${path}#${node.docAnchor || node.id}`;
    }

    function getNodeSearchText(node) {
        const relatedTitles = (node.related || [])
            .map(id => nodeLookup.get(id)?.title || id)
            .join(' ');
        const prereqTitles = (node.prerequisites || [])
            .map(id => nodeLookup.get(id)?.title || id)
            .join(' ');
        return [
            node.title,
            node.description,
            node.type,
            ...(node.usedInLabs || []),
            ...(node.keywords || []),
            relatedTitles,
            prereqTitles
        ].join(' ').toLowerCase();
    }

    function getLabFilterLabels() {
        const labels = new Set();
        skillMapData.children.forEach(domain => {
            domain.children.forEach(node => {
                (node.usedInLabs || []).forEach(label => labels.add(label));
            });
        });
        return [...labels].sort((a, b) => {
            const aSingle = /^Lab \d+$/.test(a);
            const bSingle = /^Lab \d+$/.test(b);
            if (aSingle && bSingle) return Number(a.replace('Lab ', '')) - Number(b.replace('Lab ', ''));
            if (aSingle) return -1;
            if (bSingle) return 1;
            return a.localeCompare(b);
        });
    }

    function renderPreview(container) {
        const docPath = container.dataset.docPath || 'knowledge/index.html';
        const rootSystem = makeElement('div', 'skill-preview-root-system');
        const branchSvg = createBranchSvg();
        const courseRoot = renderCourseRoot('Course root', `${skillMapData.children.length} major branches`);
        const grid = makeElement('div', 'skill-preview-grid');
        const totalConcepts = skillMapData.children.reduce((sum, domain) => sum + domain.children.length, 0);
        const countTarget = document.querySelector('[data-skill-map-count]');
        if (countTarget) countTarget.textContent = `${totalConcepts} concepts across ${skillMapData.children.length} domains, 8 lab routes, and the design project`;

        skillMapData.children.forEach(domain => {
            const card = makeElement('article', 'skill-domain-preview');
            const tag = makeElement('span', 'tag subtle', `${domain.children.length} concepts`);
            const title = makeElement('h3', '', domain.title);
            const desc = makeElement('p', '', domain.description);
            const list = makeElement('ul', 'skill-preview-list');
            domain.children.slice(0, 4).forEach(child => {
                const item = makeElement('li', 'skill-node-pill', child.title);
                list.appendChild(item);
            });

            const more = makeElement('ul', 'skill-preview-more');
            more.hidden = true;
            more.id = `preview-${domain.id}`;
            domain.children.slice(4).forEach(child => {
                more.appendChild(makeElement('li', '', child.title));
            });

            const actions = makeElement('div', 'skill-map-toolbar');
            const toggle = makeElement('button', 'skill-map-control', 'Expand preview');
            toggle.type = 'button';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-controls', more.id);
            toggle.addEventListener('click', () => {
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!expanded));
                toggle.textContent = expanded ? 'Expand preview' : 'Collapse preview';
                more.hidden = expanded;
            });

            const open = makeElement('a', 'portal-button secondary', 'Open full map');
            open.href = `${docPath}#skill-map`;
            actions.append(toggle, open);
            card.append(tag, title, desc, list, more, actions);
            grid.appendChild(card);
        });

        rootSystem.append(branchSvg, courseRoot, grid);
        container.replaceChildren(rootSystem);
        scheduleBranchDraw(rootSystem);
        observeBranchLayout(rootSystem);
    }

    function renderSkillMap(container) {
        const docPath = container.dataset.docPath || 'knowledge/index.html';
        const expandedDomains = getStoredSet('expanded-domains');
        const root = makeElement('div', 'skill-map-component');
        const controls = makeElement('div', 'skill-map-search');
        const searchGrid = makeElement('div', 'skill-map-search-grid');
        const search = makeElement('input');
        search.type = 'search';
        search.placeholder = 'Search concepts, descriptions, related terms, labs, or keywords...';
        search.setAttribute('aria-label', 'Search course skill map');
        const labFilter = makeElement('select');
        labFilter.setAttribute('aria-label', 'Filter skill map by lab');
        ['All labs', ...getLabFilterLabels()].forEach(label => {
            const option = makeElement('option', '', label);
            option.value = label;
            labFilter.appendChild(option);
        });
        searchGrid.append(search, labFilter);

        const toolbar = makeElement('div', 'skill-map-toolbar');
        const expandAll = makeElement('button', 'skill-map-control primary', 'Expand all');
        const collapseAll = makeElement('button', 'skill-map-control', 'Collapse all');
        const clearSearch = makeElement('button', 'skill-map-control', 'Clear search');
        [expandAll, collapseAll, clearSearch].forEach(button => { button.type = 'button'; });
        toolbar.append(expandAll, collapseAll, clearSearch);

        const status = makeElement('div', 'skill-map-status');
        status.setAttribute('aria-live', 'polite');
        const noResults = makeElement('div', 'skill-map-no-results', 'No matching concepts. Try a broader search or clear the lab filter.');
        controls.append(searchGrid, toolbar, status, noResults);

        const rootSystem = makeElement('div', 'skill-root-system');
        const branchSvg = createBranchSvg();
        const courseRoot = renderCourseRoot('Course root', `${skillMapData.children.length} knowledge branches`);
        const tree = makeElement('ul', 'skill-tree');
        const domainState = new Map();

        skillMapData.children.forEach(domain => {
            const domainItem = makeElement('li', 'skill-node');
            domainItem.dataset.nodeId = domain.id;
            const domainCard = renderNodeCard(domain, docPath, true);
            const childList = makeElement('ul');
            childList.id = `children-${domain.id}`;

            domain.children.forEach(child => {
                const childItem = makeElement('li', 'skill-node');
                childItem.dataset.nodeId = child.id;
                childItem.appendChild(renderNodeCard(child, docPath, false));
                childList.appendChild(childItem);
            });

            const button = domainCard.querySelector('.skill-expand');
            const shouldExpand = expandedDomains.has(domain.id);
            setExpanded(button, childList, shouldExpand);
            button.addEventListener('click', () => {
                const next = button.getAttribute('aria-expanded') !== 'true';
                setExpanded(button, childList, next);
                if (next) expandedDomains.add(domain.id);
                else expandedDomains.delete(domain.id);
                setStoredSet('expanded-domains', expandedDomains);
                scheduleBranchDraw(rootSystem);
            });

            domainItem.append(domainCard, childList);
            tree.appendChild(domainItem);
            domainState.set(domain.id, { item: domainItem, button, childList, domain, childItems: [...childList.children] });
        });

        function applySearch() {
            const query = search.value.trim().toLowerCase();
            const lab = labFilter.value;
            let matchCount = 0;
            let visibleDomains = 0;

            domainState.forEach(state => {
                const domainMatches = getNodeSearchText(state.domain).includes(query);
                let visibleChildren = 0;

                state.childItems.forEach(childItem => {
                    const node = nodeLookup.get(childItem.dataset.nodeId);
                    const queryMatch = !query || getNodeSearchText(node).includes(query) || domainMatches;
                    const labMatch = lab === 'All labs' || (node.usedInLabs || []).includes(lab);
                    const visible = queryMatch && labMatch;
                    childItem.hidden = !visible;
                    childItem.querySelector('.skill-node-card')?.classList.toggle('is-match', Boolean(query) && queryMatch);
                    if (visible) {
                        visibleChildren += 1;
                        if (query || lab !== 'All labs') matchCount += 1;
                    }
                });

                const showDomain = visibleChildren > 0 || (!query && lab === 'All labs');
                state.item.hidden = !showDomain;
                state.item.querySelector('.skill-node-card')?.classList.toggle('is-match', Boolean(query) && domainMatches);
                if (showDomain) visibleDomains += 1;

                if (query || lab !== 'All labs') {
                    setExpanded(state.button, state.childList, showDomain);
                } else {
                    setExpanded(state.button, state.childList, expandedDomains.has(state.domain.id));
                    state.childItems.forEach(childItem => {
                        childItem.hidden = false;
                        childItem.querySelector('.skill-node-card')?.classList.remove('is-match');
                    });
                }
            });

            const filtered = query || lab !== 'All labs';
            const totalConcepts = skillMapData.children.reduce((sum, domain) => sum + domain.children.length, 0);
            status.textContent = filtered
                ? `${matchCount} matching concept${matchCount === 1 ? '' : 's'} in ${visibleDomains} domain${visibleDomains === 1 ? '' : 's'}.`
                : `${totalConcepts} concepts across ${skillMapData.children.length} domains.`;
            noResults.classList.toggle('show', filtered && matchCount === 0);
            scheduleBranchDraw(rootSystem);
        }

        expandAll.addEventListener('click', () => {
            domainState.forEach(state => {
                setExpanded(state.button, state.childList, true);
                expandedDomains.add(state.domain.id);
            });
            setStoredSet('expanded-domains', expandedDomains);
            scheduleBranchDraw(rootSystem);
        });

        collapseAll.addEventListener('click', () => {
            domainState.forEach(state => {
                setExpanded(state.button, state.childList, false);
                expandedDomains.delete(state.domain.id);
            });
            setStoredSet('expanded-domains', expandedDomains);
            scheduleBranchDraw(rootSystem);
        });

        clearSearch.addEventListener('click', () => {
            search.value = '';
            labFilter.value = 'All labs';
            applySearch();
            search.focus();
        });

        search.addEventListener('input', applySearch);
        labFilter.addEventListener('change', applySearch);

        rootSystem.append(branchSvg, courseRoot, tree);
        root.append(controls, rootSystem);
        container.replaceChildren(root);
        applySearch();
        observeBranchLayout(rootSystem);
    }

    function createBranchSvg() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('skill-branch-svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        return svg;
    }

    function scheduleBranchDraw(rootSystem) {
        if (!rootSystem) return;
        window.requestAnimationFrame(() => drawSkillBranches(rootSystem));
    }

    function observeBranchLayout(rootSystem) {
        if (!('ResizeObserver' in window)) return;
        const observer = new ResizeObserver(() => scheduleBranchDraw(rootSystem));
        observer.observe(rootSystem);
        rootSystem.querySelectorAll('.course-root-card, .skill-tree, .skill-preview-grid').forEach(element => {
            observer.observe(element);
        });
    }

    function drawSkillBranches(rootSystem) {
        const svg = rootSystem.querySelector('.skill-branch-svg');
        const rootCard = rootSystem.querySelector('.course-root-card');
        if (!svg || !rootCard) {
            rootSystem.classList.add('skill-branches-fallback');
            return;
        }

        rootSystem.classList.remove('skill-branches-fallback');
        const systemBox = rootSystem.getBoundingClientRect();
        const rootBox = rootCard.getBoundingClientRect();
        const width = Math.max(1, rootSystem.scrollWidth);
        const height = Math.max(1, rootSystem.scrollHeight);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);

        const isHorizontal = window.matchMedia('(min-width: 981px)').matches && rootSystem.classList.contains('skill-root-system');
        const rootPoint = isHorizontal
            ? point(rootBox.right - systemBox.left, rootBox.top - systemBox.top + rootBox.height / 2)
            : point(rootBox.left - systemBox.left + rootBox.width / 2, rootBox.bottom - systemBox.top);

        const links = [];
        rootSystem.querySelectorAll('.skill-tree > .skill-node:not([hidden]) > .skill-node-card, .skill-preview-grid > .skill-domain-preview:not([hidden])').forEach((domainCard, index) => {
            const box = domainCard.getBoundingClientRect();
            const target = isHorizontal
                ? point(box.left - systemBox.left, box.top - systemBox.top + box.height / 2)
                : point(box.left - systemBox.left + box.width / 2, box.top - systemBox.top);
            links.push({ source: rootPoint, target, depth: 0, index });
        });

        rootSystem.querySelectorAll('.skill-tree > .skill-node:not([hidden])').forEach((domainItem, domainIndex) => {
            const domainCard = domainItem.querySelector(':scope > .skill-node-card');
            if (!domainCard) return;
            const domainBox = domainCard.getBoundingClientRect();
            const source = isHorizontal
                ? point(domainBox.right - systemBox.left, domainBox.top - systemBox.top + domainBox.height / 2)
                : point(domainBox.left - systemBox.left + domainBox.width / 2, domainBox.bottom - systemBox.top);

            domainItem.querySelectorAll(':scope > ul > .skill-node:not([hidden]) > .skill-node-card').forEach((conceptCard, index) => {
                if (!conceptCard.getClientRects().length) return;
                const conceptBox = conceptCard.getBoundingClientRect();
                const target = isHorizontal
                    ? point(conceptBox.left - systemBox.left, conceptBox.top - systemBox.top + conceptBox.height / 2)
                    : point(conceptBox.left - systemBox.left + conceptBox.width / 2, conceptBox.top - systemBox.top);
                links.push({ source, target, depth: 1, index: domainIndex + index });
            });
        });

        const line = isHorizontal ? horizontalBranchPath : verticalBranchPath;
        if (window.d3) {
            const selection = window.d3.select(svg).selectAll('path').data(links, linkKey);
            selection.join(
                enter => enter.append('path')
                    .attr('class', link => `skill-branch-path depth-${link.depth}`)
                    .attr('d', line),
                update => update
                    .attr('class', link => `skill-branch-path depth-${link.depth}`)
                    .attr('d', line),
                exit => exit.remove()
            );
            return;
        }

        svg.replaceChildren(...links.map(link => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', `skill-branch-path depth-${link.depth}`);
            path.setAttribute('d', line(link));
            return path;
        }));
    }

    function point(x, y) {
        return { x, y };
    }

    function linkKey(link) {
        return `${Math.round(link.source.x)}-${Math.round(link.source.y)}-${Math.round(link.target.x)}-${Math.round(link.target.y)}-${link.depth}`;
    }

    function horizontalBranchPath(link) {
        const dx = Math.max(80, Math.abs(link.target.x - link.source.x) * 0.52);
        const sway = ((link.index % 3) - 1) * 14;
        return `M${link.source.x},${link.source.y} C${link.source.x + dx},${link.source.y + sway} ${link.target.x - dx},${link.target.y - sway} ${link.target.x},${link.target.y}`;
    }

    function verticalBranchPath(link) {
        const dy = Math.max(54, Math.abs(link.target.y - link.source.y) * 0.5);
        const sway = ((link.index % 3) - 1) * 18;
        return `M${link.source.x},${link.source.y} C${link.source.x + sway},${link.source.y + dy} ${link.target.x - sway},${link.target.y - dy} ${link.target.x},${link.target.y}`;
    }

    function renderCourseRoot(label, meta) {
        const card = makeElement('article', 'course-root-card');
        const eyebrow = makeElement('p', 'course-root-label', label);
        const title = makeElement('h3', '', skillMapData.title);
        const desc = makeElement('p', '', skillMapData.description);
        const pill = makeElement('span', 'skill-node-pill', meta);
        card.append(eyebrow, title, desc, pill);
        return card;
    }

    function renderNodeCard(node, docPath, hasChildren) {
        const card = makeElement('article', 'skill-node-card');
        card.dataset.type = node.type;

        const header = makeElement('div', 'skill-node-header');
        const titleBlock = makeElement('div');
        const title = makeElement('h3', 'skill-node-title', node.title);
        const desc = makeElement('p', 'skill-node-description', node.description);
        titleBlock.append(title, desc);
        header.appendChild(titleBlock);

        if (hasChildren) {
            const expand = makeElement('button', 'skill-expand', '+');
            expand.type = 'button';
            expand.setAttribute('aria-label', `Expand ${node.title}`);
            expand.setAttribute('aria-expanded', 'false');
            expand.setAttribute('aria-controls', `children-${node.id}`);
            header.appendChild(expand);
        }

        const meta = makeElement('div', 'skill-node-meta');
        meta.appendChild(makeElement('span', 'skill-node-pill', node.type));
        (node.usedInLabs || []).forEach(lab => meta.appendChild(makeElement('span', 'skill-node-pill', lab)));
        meta.appendChild(makeElement('span', 'skill-match-pill', 'Search match'));

        const actions = makeElement('div', 'skill-node-links');
        if (!hasChildren) {
            const link = makeElement('a', 'skill-doc-link', documentationTodos.includes(node.id) ? 'Review nearest article' : 'Open documentation');
            link.href = getDocHref(node, docPath);
            link.dataset.skillDocLink = 'true';
            link.dataset.docAnchor = node.docAnchor || node.id;
            actions.appendChild(link);
        }

        if (!hasChildren) {
            const related = renderRelated(node);
            card.append(header, meta, actions, related);
        } else {
            card.append(header, meta);
        }
        return card;
    }

    function renderRelated(node) {
        const wrapper = makeElement('div', 'skill-related-list');

        if (node.prerequisites?.length) {
            const prereq = makeElement('div');
            const label = makeElement('strong', '', 'Prerequisites: ');
            prereq.appendChild(label);
            appendNodeLinks(prereq, node.prerequisites);
            wrapper.appendChild(prereq);
        }

        if (node.related?.length) {
            const related = makeElement('div');
            const label = makeElement('strong', '', 'Related concepts: ');
            related.appendChild(label);
            appendNodeLinks(related, node.related);
            wrapper.appendChild(related);
        }

        return wrapper;
    }

    function appendNodeLinks(parent, ids) {
        ids.forEach((id, index) => {
            const node = nodeLookup.get(id);
            if (index > 0) parent.appendChild(document.createTextNode(', '));
            const link = makeElement('a', '', node?.title || id);
            link.href = `#skill-node-${id}`;
            link.addEventListener('click', event => {
                event.preventDefault();
                const target = document.querySelector(`[data-node-id="${CSS.escape(id)}"]`);
                if (!target) return;
                target.hidden = false;
                const domain = target.closest('.skill-tree > .skill-node');
                if (domain) {
                    const button = domain.querySelector('.skill-expand');
                    const childList = domain.querySelector('ul');
                    if (button && childList) setExpanded(button, childList, true);
                }
                target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
                const focusTarget = target.querySelector('a, button');
                focusTarget?.focus();
            });
            parent.appendChild(link);
        });
    }

    function setExpanded(button, childList, expanded) {
        button.setAttribute('aria-expanded', String(expanded));
        button.textContent = expanded ? '-' : '+';
        button.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} ${button.getAttribute('aria-label')?.replace(/^Expand |^Collapse /, '') || 'branch'}`);
        childList.hidden = !expanded;
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function setupSkillViewTabs() {
        const tabs = [...document.querySelectorAll('[data-skill-view-tab]')];
        const panels = [...document.querySelectorAll('[data-skill-view-panel]')];
        if (!tabs.length || !panels.length) return;

        function updateViewHash(view) {
            const url = new URL(window.location.href);
            if (view === 'skill-map') {
                url.hash = 'skill-map';
                history.replaceState(null, '', url.toString());
                return;
            }
            if (url.hash === '#skill-map') {
                url.hash = '';
                history.replaceState(null, '', url.toString());
            }
        }

        function setView(view, shouldFocus, shouldUpdateHash) {
            tabs.forEach(tab => {
                const selected = tab.dataset.skillViewTab === view;
                tab.setAttribute('aria-selected', String(selected));
                tab.tabIndex = selected ? 0 : -1;
            });
            panels.forEach(panel => {
                const selected = panel.dataset.skillViewPanel === view;
                panel.hidden = !selected;
                if (selected && shouldFocus) {
                    panel.focus({ preventScroll: true });
                    panel.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
                }
            });
            localStorage.setItem(storageKey('view'), view);
            if (shouldUpdateHash) updateViewHash(view);
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => setView(tab.dataset.skillViewTab, true, true));
            tab.addEventListener('keydown', event => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const current = tabs.indexOf(tab);
                let next = current;
                if (event.key === 'ArrowLeft') next = current === 0 ? tabs.length - 1 : current - 1;
                if (event.key === 'ArrowRight') next = current === tabs.length - 1 ? 0 : current + 1;
                if (event.key === 'Home') next = 0;
                if (event.key === 'End') next = tabs.length - 1;
                tabs[next].focus();
                setView(tabs[next].dataset.skillViewTab, false, true);
            });
        });

        document.addEventListener('click', event => {
            const docLink = event.target.closest('[data-skill-doc-link]');
            if (!docLink || !document.querySelector('[data-skill-view-panel="documentation"]')) return;
            const anchor = docLink.dataset.docAnchor;
            const target = anchor ? document.getElementById(anchor) : null;
            if (!target) return;
            event.preventDefault();
            setView('documentation', false, false);
            history.replaceState(null, '', `#${anchor}`);
            target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
            target.tabIndex = -1;
            target.focus({ preventScroll: true });
        });

        const hash = window.location.hash.replace('#', '');
        const stored = localStorage.getItem(storageKey('view'));
        const initial = hash === 'skill-map' ? 'skill-map' : (stored === 'skill-map' ? 'skill-map' : 'documentation');
        setView(initial, false, false);
    }

    function init() {
        document.querySelectorAll('[data-skill-map-preview]').forEach(renderPreview);
        document.querySelectorAll('[data-skill-map]').forEach(renderSkillMap);
        setupSkillViewTabs();
    }

    window.SMRTTECH_SKILL_MAP = { skillMapData };
    document.addEventListener('DOMContentLoaded', init);
})();
