import React, { useEffect } from 'react';

const PieChart = ({ available, unavailable }) => {
  useEffect(() => {
    console.log('Available:', available);
    console.log('Unavailable:', unavailable);

    const availableValue = parseFloat(available) || 0;
    const unavailableValue = parseFloat(unavailable) || 0;

    const data = [
      { type: 'Available', value: availableValue },
      { type: 'Unavailable', value: unavailableValue },
    ];

    console.log('Data to be rendered:', data);  

    import('@antv/g2plot').then((G2Plot) => {
      const { Pie } = G2Plot;

      const container = document.getElementById('pie-container');
      if (container && Pie) {
        if (container._piePlot) {
          container._piePlot.destroy();
        }

        const piePlot = new Pie(container, {
          appendPadding: 10,
          title: {
            visible: true,
            text: 'Room Status',  
            style: {
              fontSize: 18,
              fontWeight: 'bold',
            },
          },
          description: {
            visible: true,
            text: 'This pie chart shows available and unavailable rooms.',  
          },
          radius: 0.8,  
          data,
          angleField: 'value', 
          colorField: 'type', 
        });

        piePlot.render();

        container._piePlot = piePlot;
      }
    }).catch((error) => {
      console.error('Error loading G2Plot:', error);
    });
  }, [available, unavailable]);  

  return <div id="pie-container" style={{ width: '350px', height: '350px' }} />;
};

export default PieChart;
