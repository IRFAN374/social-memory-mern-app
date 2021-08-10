import React, { useState, useEffect } from 'react';
import {Container, Grow, Grid,Paper,AppBar,TextField,Button } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input'
import { useDispatch } from 'react-redux';
import Posts from '../../components/Posts/Posts';
import Form from '../../components/Form/Form';
import { getPosts, getPostsBySearch } from '../../actions/posts';
//import useStyles from '../../styles';
import useStyles from './homeStyles';
import PaginationPage from '../PaginationPage';
import { useHistory, useLocation } from 'react-router-dom';


function useQuery(){
    return new URLSearchParams(useLocation().search)
}

const Home = () => {
    const [currentId, setCurrentId] = useState(0);
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    //const location = useLocation();
    const query = useQuery();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');

    // useEffect(() => {
    //   dispatch(getPosts());
    // }, [currentId,dispatch]);
    
    const handleKeyPress = (event)=>{
       if(event.keyCode === 13){
           searchPost();
       }
    }
    const handleAddChip =(tag)=>{
        setTags( [ ...tags, tag ] )
    }
    const handleDeleteChip =(tagToDelete)=>{
       setTags(
           tags.filter((tag)=> tag!==tagToDelete)
       ) 
    }

    const searchPost=()=>{
        if(search.trim() || tags){
            dispatch(getPostsBySearch({search,tags:tags.join(',')}));
            
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
            // history.push('/auth');
        }else{
            history.push('/');
        }
    }
    
    return (
        <Grow in>
            <Container maxWidth="xl">
            <Grid className={classes.gridContainer} container justify="space-between" alignItems="stretch" spacing={3}>
                <Grid item xs={12} sm={6} md={9}>
                   <Posts setCurrentId={setCurrentId} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppBar className={classes.appBarSearch} position="static" color="inherit">
                        <TextField onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search memories" fullWidth value={search} onChange={(event)=>setSearch(event.target.value)} />
                        <ChipInput style={{margin: '10px 0'}} value={tags} label="Search Tags" variant="outlined" onAdd={(chip)=> handleAddChip(chip)} onDelete={(chip)=> handleDeleteChip(chip)} />
                        <Button className={classes.searchButton} variant="contained" color="primary" onClick={searchPost} > Search </Button>
                    </AppBar>

                    <Form currentId={currentId} setCurrentId={setCurrentId} />
                    {
                        (!searchQuery && !tags.length) && (
                            <Paper className={classes.pagination} elevation={6}>
                                <PaginationPage page={page}/>
                            </Paper>
                        )
                    }

                </Grid>
                {/* <Grid item xs={12} sm={6} md={3}>
                   <Form currentId={currentId} setCurrentId={setCurrentId} />
                <Paper elevation={6}>
                   <PaginationPage/>
                </Paper>
                
                </Grid> */}
            </Grid>
            </Container>
        </Grow>
    );
};

export default Home;