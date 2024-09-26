import React, { useState, useEffect } from 'react';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { app } from '../../firebase/FirebaseConfig';
import './addMachines.css'

const AddMachines = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [machineName, setMachineName] = useState('');
  const [selectedMachineType, setSelectedMachineType] = useState('');
  const [manifacturarname, setManufacturarName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [yearOfManifacturing, setYearOfManifacturing] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [installationDate, setInstallationDate] = useState('');
  const [operatingLocation, setOperatingLocation] = useState('');
  const [machineStatus, setMachineStatus] = useState('');

  const machineTypes = [
    "Lathe Machine",
    "Milling Machine",
    "Drilling Machine",
    "Grinder Machine",
    "Sawing Machine",
    "CNC Machine",
    "Injection Molding Machine",
    "Extrusion Machine",
    "Press Machine",
    "Welding Machine",
    "Punching Machine",
    "Bending Machine",
    "Shearing Machine",
    "Rolling Machine",
    "Forklift",
    "Conveyor System",
    "Robotic Arm",
    "Packing Machine",
    "Labeling Machine",
    "Surface Treatment Machine",
    "Sandblasting Machine",
    "Heat Treatment Furnace",
    "Blow Molding Machine",
    "Casting Machine",
    "Grinding Machine",
    "Soldering Machine",
    "Cutting Machine",
    "Laser Cutting Machine",
    "Water Jet Cutting Machine",
    "Edge Banding Machine",
    "Tapping Machine",
    "Molding Machine",
    "Electroplating Machine",
    "Vacuum Forming Machine",
    "Industrial Oven",
    "Mixing Machine",
    "Batching Machine",
    "Weighing Machine",
    "Quality Inspection Machine",
    "Textile Machine",
    "Cotton Ginning Machine",
    "Knitting Machine",
    "Spinning Machine",
    "Packaging Machine",
    "Shrink Wrapping Machine",
    "Bagging Machine",
    "Form Fill Seal Machine",
    "Filling Machine",
    "Sealing Machine",
    "Sorting Machine",
    "Rivet Machine",
    "Coating Machine",
    "Industrial Chiller",
    "Compressor",
    "Dust Collector",
    "Air Purifier",
    "Mixing Tank",
    "Reactor",
    "Screw Conveyor",
    "Bucket Elevator",
    "Silo",
    "Storage Tank",
    "Hydraulic Press",
    "Electric Press",
    "Ball Mill",
    "Crusher",
    "Screening Machine",
    "Belt Conveyor",
    "Roller Conveyor",
    "Pneumatic Conveyor",
    "Gravel Machine",
    "Concrete Mixer",
    "Asphalt Plant",
    "Batch Plant",
    "Power Press",
    "Cutter Grinder",
    "Polishing Machine",
    "Cleaning Machine",
    "Ultrasonic Cleaner",
    "Chemical Mixer",
    "Heat Exchanger",
    "Piping Machine",
    "Strapping Machine",
    "Forklift Truck",
    "Scissor Lift",
    "Boom Lift",
    "Tugger",
    "Automated Guided Vehicle (AGV)",
    "Storage Retrieval System",
    "Machine Tool",
    "Sewing Machine",
    "Laser Engraving Machine",
    "3D Printer",
    "CNC Router",
    "Plasma Cutting Machine",
    "Boring Machine",
    "Belt Grinder",
    "Automated Lathe",
    "Jig Borer",
    "Surface Grinder",
    "Threading Machine",
    "Chip Shooter",
    "Stitching Machine",
    "Beverage Filling Machine",
    "Fruit Sorting Machine",
    "Slicing Machine",
    "Dicing Machine",
    "Shredding Machine",
    "Stone Crusher",
    "Granulator",
    "Bio-Diesel Production Machine"
  ];

  const generateUniqueId = () => {
    return 'MA-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };
  useEffect(() => {
    const id = generateUniqueId();
    setUniqueId(id);
  }, []);

  // Handlers for each input change
  const handleDateChange = (e) => setRequestDate(e.target.value);
  const handleMachineNameChange = (e) => setMachineName(e.target.value);
  const handleMachineTypeChange = (e) => setSelectedMachineType(e.target.value);
  const handleManufacturarNameChange = (e) => setManufacturarName(e.target.value);
  const handleModelNumberChange = (e) => setModelNumber(e.target.value);
  const handleSerialNumberChange = (e) => setSerialNumber(e.target.value);
  const handleYearOfManifacturingChange = (e) => setYearOfManifacturing(e.target.value);
  const handlePurchaseDateChange = (e) => setPurchaseDate(e.target.value);
  const handleInstallationDateChange = (e) => setInstallationDate(e.target.value);
  const handleoperationLocationChange = (e) => setOperatingLocation(e.target.value);
  const handleMachineStatus = (e) => setMachineStatus(e.target.value);

  const handleSaveMachine = async () => {
    const db = getFirestore(app);
    const machineData = {
      requestDate,
      machineName,
      selectedMachineType,
      manifacturarname,
      modelNumber,
      serialNumber,
      yearOfManifacturing,
      purchaseDate,
      installationDate,
      operatingLocation,
      machineStatus,
    };

    try {
      await setDoc(doc(db, 'Machines', uniqueId), machineData);
      alert('Machine added successfully!');
    } catch (error) {
      console.error('Error adding machine: ', error);
      alert('Failed to add machine. Please try again.');
    }
  };

  return (
    <div className='main' id='main'>
      <div className="demandConteiner">
        <h4>Add Machines</h4>
        <div className="demandHeader">
          <div>
            <label htmlFor="uniqueId">Machine ID : </label>
            <input
              type="text"
              id="uniqueId"
              value={uniqueId}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="requestDate">Date : </label>
            <input
              type="date"
              id="requestDate"
              value={requestDate}
              onChange={handleDateChange}
            />
          </div>
          <hr />
        </div>
        <div className="prioritySelections">
          <div>
            <label htmlFor="machineName">Machine Name:</label>
            <input
              type="text"
              id="machinename"
              value={machineName}
              onChange={handleMachineNameChange}
              placeholder="Enter Machine Name"
              style={{ marginRight: '10px' }}
              required
            />
          </div>

          <div>
            <label htmlFor="machineType">Machine Type:</label>
            <select
              id="priority"
              value={selectedMachineType}
              onChange={handleMachineTypeChange}
            >
              <option value="" disabled>Select Machine Type</option>
              {machineTypes.map(machineTypename => (
                <option key={machineTypename} value={machineTypename}>
                  {machineTypename}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ManufacturerName">Manufacturer Name:</label>
            <input
              type="text"
              id="manufacturar"
              value={manifacturarname}
              onChange={handleManufacturarNameChange}
              placeholder="Enter Manufacturer Name"
              style={{ marginRight: '10px' }}
              required
            />
          </div>
        </div>
        <hr />
        <div className="models">
          <div>
            <label htmlFor="machineName">Model Number:</label>
            <input
              type="text"
              id="machinename"
              value={modelNumber}
              onChange={handleModelNumberChange}
              placeholder="Enter Model Number"
              style={{ marginRight: '10px' }}
              required
            />
          </div>

          <div>
            <label htmlFor="machineName">Serial Number:</label>
            <input
              type="text"
              id="machinename"
              value={serialNumber}
              onChange={handleSerialNumberChange}
              placeholder="Enter Serial Number"
              style={{ marginRight: '10px' }}
              required
            />
          </div>

          <div>
            <label htmlFor="ManufacturerName">Year of Manufacture</label>
            <input
              type="date"
              id="manufacturar"
              value={yearOfManifacturing}
              onChange={handleYearOfManifacturingChange}
              placeholder="Enter Manufacturer Name"
              style={{ marginRight: '10px' }}
              required
            />
          </div>


          <div>
            <label htmlFor="machineName">Purchase Date:</label>
            <input
              type="date"
              id="manufacturar"
              value={purchaseDate}
              onChange={handlePurchaseDateChange}
              placeholder="Enter Manufacturer Name"
              style={{ marginRight: '10px' }}
              required
            />
          </div>

          <div>
            <label htmlFor="machineName">Installation Date:</label>
            <input
              type="date"
              id="manufacturar"
              value={installationDate}
              onChange={handleInstallationDateChange}
              placeholder="Enter Manufacturer Name"
              style={{ marginRight: '10px' }}
              required
            />
          </div>

          <div>
            <label htmlFor="ManufacturerName">Operating Location:</label>
            <input
              type="text"
              id="machinename"
              value={operatingLocation}
              onChange={handleoperationLocationChange}
              placeholder="Enter Operating Location"
              style={{ marginRight: '10px' }}
              required
            />
          </div>
          <div>
            <label htmlFor="machineName">Machine Status:</label>
            <select
              id="priority"
              value={machineStatus}
              onChange={handleMachineStatus}
            >
              <option value="" disabled>Select Machine Status</option>
              <option value="Active" >Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>
        <button onClick={handleSaveMachine} className='submit-button'>
          Add Machine
        </button>
      </div>
    </div>
  );
};

export default AddMachines;
