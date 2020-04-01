import React from 'react';

import { Typography } from '@material-ui/core';

import ChartIcon from "@material-ui/icons/InsertChartOutlined";
import HelpIcon from "@material-ui/icons/HelpOutlined";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";

import imgAlarmDialog from './alarmDialog.png';
import imgAlarmMenu from './alarmMenu.png';
import wallSocket from './wallSocket.png';
import imgDesFiO2 from './DesFiO2.png';

export const getStepContent = classes => [
    ['Using this Instructions dialog', <>
        This dialog will teach you how to use the ventilator's user interface.
        Note that you can follow the steps in order by using the
        &nbsp;<Typography variant="button" component="span">Back</Typography>&nbsp;
        and &nbsp;<Typography variant="button" component="span">Next</Typography>&nbsp;
        buttons,  or skip between steps by clicking on numbers.
    </>],
    ['Install ventilator', <>
        <ol>
            <li>Hyperextend the patient’s neck and support the back of the patient’s head with your left hand.</li>
            <li>Open the patient’s mouth with your right hand, placing your thumb and the lower jaw and middle
            finger on the upper jaw. Keep your finger as far to the right as possible so your fingers do not touch the blade.
                <ol type="a">
                    <li>Rationale: by pushing on the patient’s jaw rather than manually spreading, the mouth can be opened wider
                    </li>
                </ol>
            </li>
            <li>Pick up the blade with your left. Hold it with the blade down and pointing away from yourself.</li>
            <li>Insert the blade in the patient’s mouth, slightly to the right of the tongue.
            Keep advancing the blade until you see the tip of the epiglottis.
            As you are advancing, sweep the patient’s tongue to the left.
                 <ol type="a">
                    <li>Do not hit the patient’s teeth</li>
                    <li>Avoid catching the lips between the blade.</li>
                    <li>Macintosh Blade (curved): needs to be angled once past the teeth.</li>
                    <li>Miller blade (straight): can be inserted directly.</li>
                </ol>
            </li>
            <li>Adjust your stance: lift your left arm upwards and away from yourself, keep your elbows in, keep your back straight.
                <ol type="a">
                    <li>Rationale: poor posture put the health care professional at risk for injury,
                    eyes too close to the patients results in stereoscopic vision,
                        intubation arm relying of wrist strength results in loss of manoeuverability.</li>
                </ol>
            </li>
        </ol>
    </>],
    ['Install ventilator (continued)', <>
        <ol start="6">
            <li>View the larynx. If the patient’s head is properly tilted backwards, there should be a clear view of the larynx.
                <ol type="a">
                    <li>Macintosh Blade (curved): put pressure on the vallecula to pull the epiglottis forwards.</li>
                    <li>Miller blade (straight): epiglottis lifts itself.</li>
                    <li>Tongue must be swept to the left and blade slightly to the right of the tongue for larynx to be visible.</li>
                    <li>If you cannot see the larynx, use cricoid pressure.</li>
                </ol>
            </li>
            <li>Pass the tube through the cords into the trachea. Stop advancing the cords when you see the cuff pass the cord (~21-22 cm).
                <ol type="a">
                    <li>Proper placement: can see arytenoid cartilage behind the tube.</li>
                </ol>
            </li>
            <li>
                Hold the tube with your right hand and carefully remove the blade with your left hand.
            </li>
            <li>
                Inflate the cuff by slowly injecting air through the tube until the balloon just starts getting tense.
            </li>
            <li>Auscultate the patient’s lungs to make sure the tube was in fact places in the trachea.</li>
        </ol>

        <b>References</b>
        <ul style={{ marginTop: 0, marginBottom: 0, }}>
            <li>Kozier, B., Erb, G., Bermna, A., Buck, M., Yiu, L., &amp; Stamler, L. L. (Eds.) (2018). &nbsp;
        <i>Fundamentals of Canadian Nursing.</i> Canadian 4th ed. Toronto: Pearson Education Canada</li>
            <li>Orebaugh,S., Snyder J. V. (2020). <i>Direct Laryngoscopy and Endotracheal Intubation in Adults.</i>
        UpToDate https://www-uptodate-com.proxy3.library.mcgill.ca/contents/direct-laryngoscopy-and-endotracheal-intubation-in-adults?search=intubation&source=search_result&selectedTitle=1~150&usage_type=default&display_rank=1 </li>
        </ul>

    </>],
    ['Electric connection', <>
        Plug the ventilator into an electrical socket.
        <br />
        <img src={wallSocket} width={250} alt="Wall socket" />
    </>],
    ['General settings', <>
        To set general settings,
        press <SettingsIcon className={classes.inlineIcon} /> in the menu on the left to go to General Settings.
        <br /><br />
        Every setting is represented as a blue button or a textbox.
        To modify the setting, click on the button or textbox.
        An adjustment dialog will open. Use the slider and the buttons in the bottom-left corner to adjust your value.
        Then, press the blue "Set" button.
        <br />
        <img src={imgDesFiO2} width={750} alt="DesFiO2" />
    </>],
    ['Patient Settings', <>
        To set patient-specific settings,
        press <PersonIcon className={classes.inlineIcon} /> in the menu on the left to go to Patient Settings.
        <br /><br />
        Every setting is represented as a blue button or a textbox.
        To modify the setting, click on the button or textbox.
        An adjustment dialog will open. Use the slider and the buttons in the bottom-left corner to adjust your value.
        Then, press the blue "Set" button.
    </>],
    ['Main monitor page', <>
        On the <ChartIcon className={classes.inlineIcon} /> Monitor page,
        you can see values as they change. As well, you can set desired FiO2 (DesFiO2),
        tidal volume (VT), respiration rate (RR), and pressure signifying the end of inhalation and exhalation
        (Pinhale and Pexhale) respectively.
    </>],
    ['Alarms and Warnings', <>
        In the top bar, to the left of the date and time, there is a bell-shaped icon.
        This icon is part of the alarm system. It contains a list of all active alerts
        and information on possible repercussions and solutions.
        When no warnings or errors are active, the bell is white; when at least one is active, it is red.
        Whenever a warning or error is triggered, two things will happen:
        <ol style={{ marginTop: 0, marginBottom: 0 }}>
            <li>A dialog box will open notifying the user that so-and-so has happened and
            recommending they open the notifications menu for more information. This dialog box can be
            immediately dismissed so as not to impede the physician from viewing charts and data or modifying settings.
            <br />
                <img src={imgAlarmDialog} width={300} alt="Alarm dialog example" />
            </li>
            <li>
                The warning/error will then be added to the alarm list, which can be opened by touching the aforementioned bell icon.
            When the issue causing the warning/error is solved, its notification will automatically disappear.
            <br />
            <img src={imgAlarmMenu} width={375} alt="Alarm list example" />
            </li>
        </ol>
    </>],
    ['Support', <>
        Should you need any assistance, or should any technical malfunctions occur,
        kindly reach out to Ian Langleben at ilangleben19@gmail.com and expect a response within a few days.
        <br /><br />
        This concludes the instructions. If ever you want to see this help dialog again,
        simply click the <HelpIcon className={classes.inlineIcon} /> icon next to the title.
    </>],
];