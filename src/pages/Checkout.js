import axios from "axios";
import React, {useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Box, CssBaseline, Button, 
  GlobalStyles,Toolbar, Typography,
   Stack,} from "@mui/material";
import { Image } from 'mui-image';
import CustomerResponsiveAppBar from '../components/CustomerResponsiveAppBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const classes = {
  Header: {
      fontFamily: 'Poppins',
      fontWeight: 'bold',
      color: '#5F5B5B',
      marginTop: 5,
      marginLeft: 2,
    },
  SubHeader: {
    fontFamily: 'Poppins',
    color: '#000000',
    fontWeight: 'bold',
  },
  arrowback:{
      color: '#111111',
      width: 50,
      height: 50,
      marginTop: 5,
  },
  illustration:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  label: {
      fontFamily: 'Poppins',
      fontSize: 15,
      color: '#5F5B5B',
      marginLeft: 0,
      marginTop: 1,
  },
  labelItem: {
      fontFamily: 'Poppins',
      fontWeight: 'bold',
      color: '#00000',
      backgroundColor: '#D9D9D9',
      borderColor: '#D9D9D9',
  },
  SubmitButton: {
      fontFamily: 'Poppins',
      margin: 1,
      color: "#FFFF",
      backgroundColor: '#388E3C'
  },
  ButtonContainer:{
      fontFamily: 'Poppins',
      fontWeight: 'bold',
      color: '#00000',
      backgroundColor: '#D9D9D9',
      borderColor: '#D9D9D9',
     },
    TitleButton:{
      fontFamily: 'Poppins',
      color: '#00000',
      "&:hover": {
      color: '#FFFF',
      backgroundColor: '#388E3C',
      },
    },
    ArrowRight:{
      marginLeft: 20,
      "&:hover": {
        color: '#FFFF',
      },
    },
}







function Checkout() {
  let customer = JSON.parse(localStorage.getItem("user-info"));
  localStorage.setItem("customer", JSON.stringify(customer));

  const location = useLocation();
  const state = location.state;
  const history = useNavigate();

  console.log(state);


  const cartId = state.selectedItems[0].id;
  const sellerId = state.selectedItems[0].seller_id;
  const productId = state.selectedItems[0].product_id;
  const productName = state.selectedItems[0].name;
  const productQty = state.selectedItems[0].fruits_qty;
  const total_price = state.total;
  const price = state.selectedItems[0].price;
  const shippingfee = state.shippingFee;
  const conviencefee = state.convience;
  const grandtotal = (state.shippingFee + state.total + state.convience);
  const image = state.selectedItems[0].image;

  console.log(price)
  const [checkoutInput, setCheckoutInput] = useState({
    shippingaddress: "",
    mobilephone: "",
    modeofpayment: "",
  });

  const [error, setError] = useState([]);
  //const [orderData, setCustomer] = useState(state);

  //var totalCartPrice = 0;

  /*useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/checkout/${cart_id}`).then((res) => {
      if (res.status === 200) {
        setCustomer(res.data.customer);
        setCart(res.data.cart);
        setLoading(false);
      }
    });
  }, [cart_id]);*/


  const handleInput = (e) => {
    e.persist();
    setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
  };
  

  const submitOrder = (e) => {
    e.preventDefault();

    const orders = {
      cart_id: cartId,
      seller_id: sellerId,
      order_name: productName,
      price: price,
      product_id: productId,
      product_qty: productQty,
      shippingfee: shippingfee,
      conviencefee: conviencefee,
      total_price: grandtotal,
      firstname: customer.firstname,
      middlename: customer.middlename,
      lastname: customer.lastname,
      shippingaddress: checkoutInput.shippingaddress,
      mobilephone: checkoutInput.mobilephone,
      modeofpayment: checkoutInput.modeofpayment,
      user_id: customer.id,
      image: image,

    };

    console.log(orders)


    axios.post(`http://localhost:8000/api/place-order`, orders).then((res) => {
      if (res.data.status === 200) {
        swal("Order Placed Successfully", res.data.message, "Success");
        setError([]);
        history("/basket");
      } else if (res.data.status === 422) {
        swal("All fields are mandatory", "", "error");
        setError(res.data.errors);
      }
    });
  };

  /*if (loading) {
    return <h4>Loading Checkout Details...</h4>;
  }*/
  var checkOutDetails = "";
  checkOutDetails = state.selectedItems.map( (item, idx) => {
    return(
      <> 
      <Box sx = {classes.illustration}>
      <Image width="120px" alt={item.image} duration={0} src={`http://localhost:8000/${item.image}`}/>
      </Box>
      <Box sx = {classes.illustration}>
        <Typography variant='h5' sx={classes. SubHeader}>
        {item.name}
        </Typography>
        </Box>
        <Box sx = {classes.illustration}>
        <Typography variant='o' sx={classes. SubHeader}>
        Quantity: {item.fruits_qty}
        </Typography>
        </Box>
        <Box sx = {classes.illustration}>
        <Typography variant='p' sx={classes. SubHeader}>
        Price: Php {item.price}.00
        </Typography>
      </Box>
      </>
    )
  })
  //totalCartPrice += data.price * data.fruits_qty;
  /*
        var showCheckOutDetails = "";
        showCheckOutDetails = cart.map( (item, idx) => {
            totalCartPrice += item.price * item.fruits_qty;
            return(
                <div className='col-md-12' key={idx}>
                    <div className='card'>
                        <div className='card-body'>
                            <h6>{item.name}</h6>
                            <h6>Php: {item.price * item.fruits_qty}.00</h6>
                        </div>
                    </div>
                    <br></br>
                    <div  className="form-group mb-3">
                        <div className="material-textfield">
                            <input placeholder=" " name="address" type="text"/>
                        <label>Shipping Address</label>
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <div className="material-textfield">
                        <select name="modeofpayment" id="modeofpayment"  className="form-control">
                            <option value="default" selected hidden>Select mode of payment</option>
                            <option value = "Cash on Delivery">Cash on Delivery (pay when you receive) </option>
                                <option value = "Online Payment">Online Payment (Thru Gcash)</option>
                        </select>
                        </div>
                    </div>
                    <div  className="form-group mb-3">
                        <div className="material-textfield">
                            <input placeholder=" " name="voucher" type="text"/>
                        <label>Enter your voucher code</label>
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <p>Order Amount: {totalCartPrice}</p>
                    </div>
                        <div className="form-group mb-3">
                            <p>Subtotal: {totalCartPrice}</p>
                        </div>
                    </div>
            )
        });*/

  return (
    <>
    <CssBaseline />
      <GlobalStyles
        styles={{
          body: { backgroundColor: "#F4F4F4" },
        }}
    />
    <CustomerResponsiveAppBar/>
        <Box component="main" sx={{ p: 3 }}>
            <Box
            component="main"
            sx={{ flexGrow: 1, p: 3 }}
            >   
                <Toolbar id="back-to-top-anchor"/>
                <Stack direction='row'>
                    <Button onClick={() => history('/basket')}>
                        <ArrowBackIcon sx = {classes.arrowback}/>
                    </Button>
                    <Typography variant='h3' sx={classes.Header}>
                      Checkout Details
                      </Typography>
                </Stack>
                <Stack direction='column' spacing={2}> 
                {checkOutDetails}
                </Stack>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    name="shippingaddress"
                    onChange={handleInput}
                    value={checkoutInput.shippingaddress}
                    className="form-control"
                    placeholder="Enter Shipping Address"
                  />
                  <small className="text-danger">
                  {error.shippingaddress}
                  </small>
                  </div>
                 <div className="form-group mb-3">
                  <select
                   type="text"
                  id="modeofpayment"
                  name="modeofpayment"
                  onChange={handleInput}
                  value={checkoutInput.modeofpayment}
                  className="form-control"
                  placeholder="Choose mode of payment"
                  >
                  <option value="default" selected hidden>
                  Payment Method
                  </option>
                  <option value="Cash on Delivery">
                      Cash on Delivery (pay when you order)
                  </option>
                  </select>
                  <small className="text-danger">
                     {error.modeofpayment}
                  </small>
                  </div>
                  <div className="form-group mb-3">
                  <input
                  type="text"
                  name="mobilephone"
                  onChange={handleInput}
                  value={checkoutInput.mobilephone}
                  className="form-control"
                  placeholder="Mobile Phone"
                  />
                  <small className="text-danger">
                    {error.mobilephone}
                  </small>
                  </div>
                  <p>Shipping Fee: Php {shippingfee}.00</p>
                  <p>Convience Fee: Php {conviencefee}.00</p>
                  <p>Subtotal: Php {total_price}.00</p>
                  <p>Total (including shipping fee): Php {grandtotal}.00</p>
                  <hr />
                  <Button sx={classes.SubmitButton} onClick={submitOrder} aria-label="add">
                    PLACE ORDER
                  </Button>
        
                </Box>
                </Box>
   

                       
    </>
  );
}

export default Checkout;
