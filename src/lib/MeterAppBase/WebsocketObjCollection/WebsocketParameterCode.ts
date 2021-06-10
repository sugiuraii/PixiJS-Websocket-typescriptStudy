/* 
 * The MIT License
 *
 * Copyright 2017 kuniaki.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

export type WebsocketParameterCode =
    // Copied from OBDII parameter code
    "Engine_Load" |
    "Coolant_Temperature" |
    "Air_Fuel_Correction_1" |
    "Air_Fuel_Learning_1" |
    "Air_Fuel_Correction_2" |
    "Air_Fuel_Learning_2" |
    "Fuel_Tank_Pressure" |
    "Manifold_Absolute_Pressure" |
    "Engine_Speed" |
    "Vehicle_Speed" |
    "Ignition_Timing" |
    "Intake_Air_Temperature" |
    "Mass_Air_Flow" |
    "Throttle_Opening_Angle" |
    "Run_time_since_engine_start" |
    "Distance_traveled_with_MIL_on" |
    "Fuel_Rail_Pressure" |
    "Fuel_Rail_Pressure_diesel" |
    "Commanded_EGR" |
    "EGR_Error" |
    "Commanded_evaporative_purge" |
    "Fuel_Level_Input" |
    "Number_of_warmups_since_codes_cleared" |
    "Distance_traveled_since_codes_cleared" |
    "Evap_System_Vapor_Pressure" |
    "Atmospheric_Pressure" |
    "Catalyst_TemperatureBank_1_Sensor_1" |
    "Catalyst_TemperatureBank_2_Sensor_1" |
    "Catalyst_TemperatureBank_1_Sensor_2" |
    "Catalyst_TemperatureBank_2_Sensor_2" |
    "Battery_Voltage" |
    "Absolute_load_value" |
    "Command_equivalence_ratio" |
    "Relative_throttle_position" |
    "Ambient_air_temperature" |
    "Absolute_throttle_position_B" |
    "Absolute_throttle_position_C" |
    "Accelerator_pedal_position_D" |
    "Accelerator_pedal_position_E" |
    "Accelerator_pedal_position_F" |
    "Commanded_throttle_actuator" |
    "Time_run_with_MIL_on" |
    "Time_since_trouble_codes_cleared" |
    "Ethanol_fuel_percent" |
    "O2Sensor_1_Air_Fuel_Correction" |
    "O2Sensor_2_Air_Fuel_Correction" |
    "O2Sensor_3_Air_Fuel_Correction" |
    "O2Sensor_4_Air_Fuel_Correction" |
    "O2Sensor_5_Air_Fuel_Correction" |
    "O2Sensor_6_Air_Fuel_Correction" |
    "O2Sensor_7_Air_Fuel_Correction" |
    "O2Sensor_8_Air_Fuel_Correction" |
    "O2Sensor_1_Air_Fuel_Ratio" |
    "O2Sensor_2_Air_Fuel_Ratio" |
    "O2Sensor_3_Air_Fuel_Ratio" |
    "O2Sensor_4_Air_Fuel_Ratio" |
    "O2Sensor_5_Air_Fuel_Ratio" |
    "O2Sensor_6_Air_Fuel_Ratio" |
    "O2Sensor_7_Air_Fuel_Ratio" |
    "O2Sensor_8_Air_Fuel_Ratio" |
    "Evap_system_vapor_pressure" |
    "Fuel_rail_absolute_pressure" |
    "Relative_accelerator_pedal_position" |
    "Hybrid_battery_pack_remaining_life" |
    "Engine_oil_temperature" |
    "Fuel_injection_timing" |
    "Engine_fuel_rate" |
    "Driver_demand_engine_percent_torque" |
    "Actual_engine_percent_torque" |
    "Engine_reference_torque" |
    // SSM (parameter code) unique code
    "Front_O2_Sensor_1" |
    "Rear_O2_Sensor" |
    "Front_O2_Sensor_2" |
    "Air_Flow_Sensor_Voltage" |
    "Throttle_Sensor_Voltage" |
    "Differential_Pressure_Sensor_Voltage" |
    "Fuel_Injection_1_Pulse_Width" |
    "Fuel_Injection_2_Pulse_Width" |
    "Knock_Correction" |
    "Manifold_Relative_Pressure" |
    "Pressure_Differential_Sensor" |
    "CO_Adjustment" |
    "Learned_Ignition_Timing" |
    "Accelerator_Opening_Angle" |
    "Fuel_Temperature" |
    "Front_O2_Heater_1" |
    "Rear_O2_Heater_Current" |
    "Front_O2_Heater_2" |
    "Fuel_Level" |
    "Primary_Wastegate_Duty_Cycle" |
    "Secondary_Wastegate_Duty_Cycle" |
    "CPC_Valve_Duty_Ratio" |
    "Tumble_Valve_Position_Sensor_Right" |
    "Tumble_Valve_Position_Sensor_Left" |
    "Idle_Speed_Control_Valve_Duty_Ratio" |
    "Air_Fuel_Lean_Correction" |
    "Air_Fuel_Heater_Duty" |
    "Idle_Speed_Control_Valve_Step" |
    "Number_of_Ex_Gas_Recirc_Steps" |
    "Alternator_Duty" |
    "Fuel_Pump_Duty" |
    "Intake_VVT_Advance_Angle_Right" |
    "Intake_VVT_Advance_Angle_Left" |
    "Intake_OCV_Duty_Right" |
    "Intake_OCV_Duty_Left" |
    "Intake_OCV_Current_Right" |
    "Intake_OCV_Current_Left" |
    "Air_Fuel_Sensor_1_Current" |
    "Air_Fuel_Sensor_2_Current" |
    "Air_Fuel_Sensor_1_Resistance" |
    "Air_Fuel_Sensor_2_Resistance" |
    "Air_Fuel_Sensor_1" |
    "Air_Fuel_Sensor_2" |
    "Gear_Position" |
    "A_F_Sensor_1_Heater_Current" |
    "A_F_Sensor_2_Heater_Current" |
    "Roughness_Monitor_Cylinder_1" |
    "Roughness_Monitor_Cylinder_2" |
    "Air_Fuel_Correction_3" |
    "Air_Fuel_Learning_3" |
    "Rear_O2_Heater_Voltage" |
    "Air_Fuel_Adjustment_Voltage" |
    "Roughness_Monitor_Cylinder_3" |
    "Roughness_Monitor_Cylinder_4" |
    "Throttle_Motor_Duty" |
    "Throttle_Motor_Voltage" |
    "Sub_Throttle_Sensor" |
    "Main_Throttle_Sensor" |
    "Sub_Accelerator_Sensor" |
    "Main_Accelerator_Sensor" |
    "Brake_Booster_Pressure" |
    "Exhaust_Gas_Temperature" |
    "Cold_Start_Injector" |
    "SCV_Step" |
    "Memorised_Cruise_Speed" |
    "Exhaust_VVT_Advance_Angle_Right" |
    "Exhaust_VVT_Advance_Angle_Left" |
    "Exhaust_OCV_Duty_Right" |
    "Exhaust_OCV_Duty_Left" |
    "Exhaust_OCV_Current_Right" |
    "Exhaust_OCV_Current_Left" |
    // Arduino unique code
    "Oil_Temperature2" |
    "Oil_Pressure";
